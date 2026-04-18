/**
 * Comprehensive Test Suite for Stripe Webhook Handlers
 * Tests all 20+ webhook events with various scenarios
 * Uses Vitest + Mock Stripe SDK
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import stripe from 'stripe';
import { db } from '../db';
import {
  handlePaymentIntentSucceeded,
  handlePaymentIntentPaymentFailed,
  handlePaymentIntentCanceled,
  handleCheckoutSessionCompleted,
  handleCheckoutSessionExpired,
  handleCheckoutSessionAsyncPaymentSucceeded,
  handleCheckoutSessionAsyncPaymentFailed,
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionUpdated,
  handleCustomerSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleInvoiceUpcoming,
  handleInvoiceFinalized,
  handleCustomerCreated,
  handleCustomerUpdated,
  handleCustomerDeleted,
  handleChargeSucceeded,
  handleChargeFailed,
  handleChargeRefunded,
  handleChargeDisputeCreated,
} from './webhook-handlers';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const createMockPaymentIntent = (overrides = {}): stripe.PaymentIntent => ({
  id: 'pi_test_123',
  object: 'payment_intent',
  amount: 9999,
  currency: 'usd',
  status: 'succeeded',
  customer: 'cus_test_123',
  metadata: {
    user_id: '1',
    tier_id: '1',
  },
  payment_method_types: ['card'],
  ...overrides,
} as stripe.PaymentIntent);

const createMockCheckoutSession = (overrides = {}): stripe.Checkout.Session => ({
  id: 'cs_test_123',
  object: 'checkout.session',
  customer: 'cus_test_123',
  subscription: 'sub_test_123',
  payment_status: 'paid',
  status: 'complete',
  metadata: {
    user_id: '1',
    tier_id: '1',
  },
  ...overrides,
} as stripe.Checkout.Session);

const createMockSubscription = (overrides = {}): stripe.Subscription => ({
  id: 'sub_test_123',
  object: 'subscription',
  customer: 'cus_test_123',
  status: 'active',
  current_period_start: Math.floor(Date.now() / 1000),
  current_period_end: Math.floor(Date.now() / 1000) + 2592000,
  items: {
    object: 'list',
    data: [
      {
        plan: {
          interval: 'month',
          amount: 9999,
        },
      } as any,
    ],
  } as any,
  metadata: {
    user_id: '1',
    tier_id: '1',
  },
  ...overrides,
} as stripe.Subscription);

const createMockInvoice = (overrides = {}): stripe.Invoice => ({
  id: 'in_test_123',
  object: 'invoice',
  customer: 'cus_test_123',
  subscription: 'sub_test_123',
  number: 'INV-001',
  status: 'paid',
  paid: true,
  paid_date: Math.floor(Date.now() / 1000),
  amount_paid: 9999,
  amount_due: 0,
  subtotal: 9999,
  tax: 0,
  total: 9999,
  currency: 'usd',
  metadata: {
    user_id: '1',
    tier_id: '1',
  },
  ...overrides,
} as stripe.Invoice);

const createMockCustomer = (overrides = {}): stripe.Customer => ({
  id: 'cus_test_123',
  object: 'customer',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
} as stripe.Customer);

const createMockCharge = (overrides = {}): stripe.Charge => ({
  id: 'ch_test_123',
  object: 'charge',
  amount: 9999,
  currency: 'usd',
  status: 'succeeded',
  customer: 'cus_test_123',
  ...overrides,
} as stripe.Charge);

const createMockDispute = (overrides = {}): stripe.Dispute => ({
  id: 'dp_test_123',
  object: 'dispute',
  charge: 'ch_test_123',
  amount: 9999,
  currency: 'usd',
  reason: 'fraudulent',
  status: 'warning_under_review',
  ...overrides,
} as stripe.Dispute);

const createMockEvent = (type: string, data: any): stripe.Event => ({
  id: 'evt_test_123',
  object: 'event',
  type,
  data: { object: data },
  created: Math.floor(Date.now() / 1000),
} as stripe.Event);

// ============================================================================
// TEST SETUP
// ============================================================================

describe('Stripe Webhook Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up test data
    await db.delete(require('../schema').paymentIntents).where(true);
    await db.delete(require('../schema').userSubscriptions).where(true);
    await db.delete(require('../schema').invoices).where(true);
    await db.delete(require('../schema').webhookEvents).where(true);
  });

  // ========================================================================
  // PAYMENT INTENT TESTS
  // ========================================================================

  describe('Payment Intent Events', () => {
    it('should handle payment_intent.succeeded', async () => {
      const paymentIntent = createMockPaymentIntent();
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await handlePaymentIntentSucceeded(event);

      // Verify payment intent was created
      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi).toBeDefined();
      expect(pi?.status).toBe('succeeded');
      expect(pi?.amount).toBe(99.99);

      // Verify user role was updated
      const user = await db.query.users.findFirst({
        where: (table) => table.id.eq(1),
      });
      expect(user?.role).toBe('member');
      expect(user?.membershipStatus).toBe('active');
    });

    it('should handle payment_intent.payment_failed', async () => {
      const paymentIntent = createMockPaymentIntent({
        status: 'requires_payment_method',
        last_payment_error: {
          message: 'Card declined',
          code: 'card_declined',
        },
      });
      const event = createMockEvent('payment_intent.payment_failed', paymentIntent);

      await handlePaymentIntentPaymentFailed(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi).toBeDefined();
      expect(pi?.status).toBe('requires_payment_method');
      expect(pi?.failureCode).toBe('card_declined');
      expect(pi?.failureMessage).toBe('Card declined');
    });

    it('should handle payment_intent.canceled', async () => {
      const paymentIntent = createMockPaymentIntent({
        status: 'canceled',
      });
      const event = createMockEvent('payment_intent.canceled', paymentIntent);

      await handlePaymentIntentCanceled(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi).toBeDefined();
      expect(pi?.status).toBe('canceled');
    });

    it('should throw error when user_id is missing', async () => {
      const paymentIntent = createMockPaymentIntent({
        metadata: { tier_id: '1' }, // Missing user_id
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await expect(handlePaymentIntentSucceeded(event)).rejects.toThrow(
        'Missing user_id or tier_id'
      );
    });

    it('should handle payment with different currencies', async () => {
      const paymentIntent = createMockPaymentIntent({
        currency: 'eur',
        amount: 8500,
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await handlePaymentIntentSucceeded(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi?.currency).toBe('EUR');
      expect(pi?.amount).toBe(85.00);
    });

    it('should handle payment with different payment methods', async () => {
      const paymentIntent = createMockPaymentIntent({
        payment_method_types: ['bank_transfer'],
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await handlePaymentIntentSucceeded(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi?.paymentMethodType).toBe('bank_transfer');
    });
  });

  // ========================================================================
  // CHECKOUT SESSION TESTS
  // ========================================================================

  describe('Checkout Session Events', () => {
    it('should handle checkout.session.completed', async () => {
      const session = createMockCheckoutSession();
      const event = createMockEvent('checkout.session.completed', session);

      // Mock Stripe subscription retrieval
      vi.spyOn(stripe.subscriptions, 'retrieve').mockResolvedValue(
        createMockSubscription()
      );

      await handleCheckoutSessionCompleted(event);

      // Verify subscription was created
      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub).toBeDefined();
      expect(sub?.status).toBe('active');

      // Verify user was upgraded
      const user = await db.query.users.findFirst({
        where: (table) => table.id.eq(1),
      });
      expect(user?.role).toBe('member');
    });

    it('should handle checkout.session.expired', async () => {
      const session = createMockCheckoutSession({
        status: 'expired',
      });
      const event = createMockEvent('checkout.session.expired', session);

      // Should not throw
      await expect(handleCheckoutSessionExpired(event)).resolves.not.toThrow();
    });

    it('should handle checkout.session.async_payment_succeeded', async () => {
      // Create subscription first
      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'incomplete',
      });

      const session = createMockCheckoutSession();
      const event = createMockEvent('checkout.session.async_payment_succeeded', session);

      await handleCheckoutSessionAsyncPaymentSucceeded(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.status).toBe('active');
    });

    it('should handle checkout.session.async_payment_failed', async () => {
      // Create subscription first
      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'active',
      });

      const session = createMockCheckoutSession();
      const event = createMockEvent('checkout.session.async_payment_failed', session);

      await handleCheckoutSessionAsyncPaymentFailed(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.status).toBe('incomplete');
    });
  });

  // ========================================================================
  // SUBSCRIPTION TESTS
  // ========================================================================

  describe('Subscription Events', () => {
    it('should handle customer.subscription.created', async () => {
      const subscription = createMockSubscription();
      const event = createMockEvent('customer.subscription.created', subscription);

      await handleCustomerSubscriptionCreated(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub).toBeDefined();
      expect(sub?.status).toBe('active');
      expect(sub?.billingCycle).toBe('month');

      const user = await db.query.users.findFirst({
        where: (table) => table.id.eq(1),
      });
      expect(user?.role).toBe('member');
    });

    it('should handle customer.subscription.updated - status change', async () => {
      // Create subscription first
      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'active',
      });

      const subscription = createMockSubscription({
        status: 'past_due',
      });
      const event = createMockEvent('customer.subscription.updated', subscription);

      await handleCustomerSubscriptionUpdated(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.status).toBe('past_due');
    });

    it('should handle customer.subscription.updated - tier upgrade', async () => {
      // Create subscription first
      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'active',
      });

      const subscription = createMockSubscription({
        metadata: {
          user_id: '1',
          tier_id: '2', // Upgraded to pro
        },
      });
      const event = createMockEvent('customer.subscription.updated', subscription);

      await handleCustomerSubscriptionUpdated(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.tierId).toBe(2);
    });

    it('should handle customer.subscription.deleted', async () => {
      // Create subscription and user first
      await db.insert(require('../schema').users).values({
        id: 1,
        openId: 'test_open_id',
        email: 'test@example.com',
        role: 'member',
      });

      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'active',
      });

      const subscription = createMockSubscription({
        status: 'canceled',
      });
      const event = createMockEvent('customer.subscription.deleted', subscription);

      await handleCustomerSubscriptionDeleted(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.status).toBe('canceled');
      expect(sub?.canceledAt).toBeDefined();

      const user = await db.query.users.findFirst({
        where: (table) => table.id.eq(1),
      });
      expect(user?.role).toBe('user');
      expect(user?.membershipStatus).toBe('canceled');
    });

    it('should handle subscription status transitions', async () => {
      const statuses = ['active', 'past_due', 'trialing', 'incomplete', 'canceled'];

      for (const status of statuses) {
        await db.insert(require('../schema').userSubscriptions).values({
          userId: 1,
          tierId: 1,
          stripeSubscriptionId: `sub_test_${status}`,
          status: 'active',
        });

        const subscription = createMockSubscription({
          id: `sub_test_${status}`,
          status: status as any,
        });
        const event = createMockEvent('customer.subscription.updated', subscription);

        await handleCustomerSubscriptionUpdated(event);

        const sub = await db.query.userSubscriptions.findFirst({
          where: (table) => table.stripeSubscriptionId.eq(`sub_test_${status}`),
        });
        expect(sub?.status).toBe(status);
      }
    });
  });

  // ========================================================================
  // INVOICE TESTS
  // ========================================================================

  describe('Invoice Events', () => {
    it('should handle invoice.paid', async () => {
      const invoice = createMockInvoice();
      const event = createMockEvent('invoice.paid', invoice);

      await handleInvoicePaid(event);

      const inv = await db.query.invoices.findFirst({
        where: (table) => table.stripeInvoiceId.eq('in_test_123'),
      });
      expect(inv).toBeDefined();
      expect(inv?.status).toBe('paid');
      expect(inv?.total).toBe(99.99);
      expect(inv?.amountPaid).toBe(99.99);
    });

    it('should handle invoice.payment_failed', async () => {
      // Create subscription first
      await db.insert(require('../schema').userSubscriptions).values({
        userId: 1,
        tierId: 1,
        stripeSubscriptionId: 'sub_test_123',
        status: 'active',
      });

      const invoice = createMockInvoice({
        status: 'open',
        paid: false,
      });
      const event = createMockEvent('invoice.payment_failed', invoice);

      await handleInvoicePaymentFailed(event);

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.userId.eq(1),
      });
      expect(sub?.status).toBe('past_due');
    });

    it('should handle invoice.upcoming', async () => {
      const invoice = createMockInvoice({
        status: 'draft',
      });
      const event = createMockEvent('invoice.upcoming', invoice);

      // Should not throw
      await expect(handleInvoiceUpcoming(event)).resolves.not.toThrow();
    });

    it('should handle invoice.finalized', async () => {
      const invoice = createMockInvoice({
        status: 'open',
      });
      const event = createMockEvent('invoice.finalized', invoice);

      // Should not throw
      await expect(handleInvoiceFinalized(event)).resolves.not.toThrow();
    });

    it('should handle invoices with tax', async () => {
      const invoice = createMockInvoice({
        subtotal: 9000,
        tax: 999,
        total: 9999,
      });
      const event = createMockEvent('invoice.paid', invoice);

      await handleInvoicePaid(event);

      const inv = await db.query.invoices.findFirst({
        where: (table) => table.stripeInvoiceId.eq('in_test_123'),
      });
      expect(inv?.subtotal).toBe(90.00);
      expect(inv?.tax).toBe(9.99);
      expect(inv?.total).toBe(99.99);
    });
  });

  // ========================================================================
  // CUSTOMER TESTS
  // ========================================================================

  describe('Customer Events', () => {
    it('should handle customer.created', async () => {
      const customer = createMockCustomer();
      const event = createMockEvent('customer.created', customer);

      // Should not throw
      await expect(handleCustomerCreated(event)).resolves.not.toThrow();
    });

    it('should handle customer.updated', async () => {
      const customer = createMockCustomer({
        email: 'newemail@example.com',
      });
      const event = createMockEvent('customer.updated', customer);

      // Should not throw
      await expect(handleCustomerUpdated(event)).resolves.not.toThrow();
    });

    it('should handle customer.deleted', async () => {
      const customer = createMockCustomer();
      const event = createMockEvent('customer.deleted', customer);

      // Should not throw
      await expect(handleCustomerDeleted(event)).resolves.not.toThrow();
    });
  });

  // ========================================================================
  // CHARGE TESTS
  // ========================================================================

  describe('Charge Events', () => {
    it('should handle charge.succeeded', async () => {
      const charge = createMockCharge();
      const event = createMockEvent('charge.succeeded', charge);

      // Should not throw
      await expect(handleChargeSucceeded(event)).resolves.not.toThrow();
    });

    it('should handle charge.failed', async () => {
      const charge = createMockCharge({
        status: 'failed',
        failure_message: 'Card declined',
      });
      const event = createMockEvent('charge.failed', charge);

      // Should not throw
      await expect(handleChargeFailed(event)).resolves.not.toThrow();
    });

    it('should handle charge.refunded', async () => {
      const charge = createMockCharge({
        refunded: true,
        amount_refunded: 9999,
      });
      const event = createMockEvent('charge.refunded', charge);

      // Should not throw
      await expect(handleChargeRefunded(event)).resolves.not.toThrow();
    });

    it('should handle charge.dispute.created', async () => {
      const dispute = createMockDispute();
      const event = createMockEvent('charge.dispute.created', dispute);

      // Should not throw
      await expect(handleChargeDisputeCreated(event)).resolves.not.toThrow();
    });
  });

  // ========================================================================
  // EDGE CASES & ERROR HANDLING
  // ========================================================================

  describe('Edge Cases & Error Handling', () => {
    it('should handle missing metadata gracefully', async () => {
      const paymentIntent = createMockPaymentIntent({
        metadata: {},
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await expect(handlePaymentIntentSucceeded(event)).rejects.toThrow();
    });

    it('should handle null customer ID', async () => {
      const paymentIntent = createMockPaymentIntent({
        customer: null,
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      // Should still process
      await handlePaymentIntentSucceeded(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi?.stripeCustomerId).toBeNull();
    });

    it('should handle duplicate webhook events', async () => {
      const paymentIntent = createMockPaymentIntent();
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      // Process twice
      await handlePaymentIntentSucceeded(event);
      await expect(handlePaymentIntentSucceeded(event)).rejects.toThrow(
        'Unique constraint violation'
      );
    });

    it('should handle large amounts correctly', async () => {
      const paymentIntent = createMockPaymentIntent({
        amount: 999999999, // $9,999,999.99
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await handlePaymentIntentSucceeded(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi?.amount).toBe(9999999.99);
    });

    it('should handle zero amount payments', async () => {
      const paymentIntent = createMockPaymentIntent({
        amount: 0,
      });
      const event = createMockEvent('payment_intent.succeeded', paymentIntent);

      await handlePaymentIntentSucceeded(event);

      const pi = await db.query.paymentIntents.findFirst({
        where: (table) => table.stripePaymentIntentId.eq(paymentIntent.id),
      });
      expect(pi?.amount).toBe(0);
    });

    it('should handle concurrent webhook processing', async () => {
      const events = Array.from({ length: 10 }, (_, i) =>
        createMockEvent('payment_intent.succeeded', createMockPaymentIntent({
          id: `pi_test_${i}`,
          metadata: { user_id: `${i + 1}`, tier_id: '1' },
        }))
      );

      await Promise.all(
        events.map((event) => handlePaymentIntentSucceeded(event))
      );

      const pis = await db.query.paymentIntents.findMany();
      expect(pis.length).toBe(10);
    });
  });

  // ========================================================================
  // INTEGRATION TESTS
  // ========================================================================

  describe('Integration Tests', () => {
    it('should handle complete subscription lifecycle', async () => {
      // 1. Customer created
      const customer = createMockCustomer();
      const customerEvent = createMockEvent('customer.created', customer);
      await handleCustomerCreated(customerEvent);

      // 2. Checkout completed
      const session = createMockCheckoutSession();
      const checkoutEvent = createMockEvent('checkout.session.completed', session);
      vi.spyOn(stripe.subscriptions, 'retrieve').mockResolvedValue(
        createMockSubscription()
      );
      await handleCheckoutSessionCompleted(checkoutEvent);

      // 3. Invoice paid
      const invoice = createMockInvoice();
      const invoiceEvent = createMockEvent('invoice.paid', invoice);
      await handleInvoicePaid(invoiceEvent);

      // 4. Subscription updated (tier upgrade)
      const updatedSub = createMockSubscription({
        metadata: { user_id: '1', tier_id: '2' },
      });
      const updateEvent = createMockEvent('customer.subscription.updated', updatedSub);
      await handleCustomerSubscriptionUpdated(updateEvent);

      // 5. Subscription canceled
      const canceledSub = createMockSubscription({ status: 'canceled' });
      const cancelEvent = createMockEvent('customer.subscription.deleted', canceledSub);
      await handleCustomerSubscriptionDeleted(cancelEvent);

      // Verify final state
      const user = await db.query.users.findFirst({
        where: (table) => table.id.eq(1),
      });
      expect(user?.role).toBe('user'); // Downgraded after cancellation
      expect(user?.membershipStatus).toBe('canceled');

      const sub = await db.query.userSubscriptions.findFirst({
        where: (table) => table.stripeSubscriptionId.eq('sub_test_123'),
      });
      expect(sub?.status).toBe('canceled');
    });

    it('should handle payment retry flow', async () => {
      // 1. Initial payment fails
      const failedPI = createMockPaymentIntent({
        status: 'requires_payment_method',
        last_payment_error: { message: 'Card declined', code: 'card_declined' },
      });
      const failEvent = createMockEvent('payment_intent.payment_failed', failedPI);
      await handlePaymentIntentPaymentFailed(failEvent);

      // 2. Retry succeeds
      const successPI = createMockPaymentIntent({
        id: 'pi_test_retry',
        status: 'succeeded',
      });
      const successEvent = createMockEvent('payment_intent.succeeded', successPI);
      await handlePaymentIntentSucceeded(successEvent);

      // Verify both records exist
      const pis = await db.query.paymentIntents.findMany();
      expect(pis.length).toBe(2);
      expect(pis.some((pi) => pi.status === 'requires_payment_method')).toBe(true);
      expect(pis.some((pi) => pi.status === 'succeeded')).toBe(true);
    });
  });
});
