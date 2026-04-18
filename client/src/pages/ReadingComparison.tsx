import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface TarotReading {
  id: string;
  spreadType: string;
  cards: Array<{
    name: string;
    suit: string;
    isReversed: boolean;
  }>;
  interpretation: string;
  timestamp: number;
  notes?: string;
}

export default function ReadingComparison() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [selectedReading1, setSelectedReading1] = useState<string>('');
  const [selectedReading2, setSelectedReading2] = useState<string>('');
  const [comparison, setComparison] = useState<{
    sameCards: number;
    differentCards: number;
    sameOrientations: number;
    differentOrientations: number;
    spreadTypes: { type1: string; type2: string };
  } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>('');
  const [analysisCache, setAnalysisCache] = useState<Record<string, string>>({});
  const analyzeReadingMutation = trpc.tarot.analyzeReadingComparison.useMutation();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Load readings from localStorage
    const savedReadings = localStorage.getItem('tarotReadings');
    if (savedReadings) {
      const parsed = JSON.parse(savedReadings);
      setReadings(parsed);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedReading1 && selectedReading2) {
      const reading1 = readings.find(r => r.id === selectedReading1);
      const reading2 = readings.find(r => r.id === selectedReading2);

      if (reading1 && reading2) {
        // Calculate comparison metrics
        let sameCards = 0;
        let differentCards = 0;
        let sameOrientations = 0;
        let differentOrientations = 0;

        const minLength = Math.min(reading1.cards.length, reading2.cards.length);
        for (let i = 0; i < minLength; i++) {
          if (reading1.cards[i].name === reading2.cards[i].name) {
            sameCards++;
            if (reading1.cards[i].isReversed === reading2.cards[i].isReversed) {
              sameOrientations++;
            } else {
              differentOrientations++;
            }
          } else {
            differentCards++;
          }
        }

        setComparison({
          sameCards,
          differentCards,
          sameOrientations,
          differentOrientations,
          spreadTypes: {
            type1: reading1.spreadType,
            type2: reading2.spreadType,
          },
        });
        // Reset AI analysis when readings change
        setAiAnalysis('');
        setAnalysisError('');
      }
    }
  }, [selectedReading1, selectedReading2, readings]);

  const reading1 = readings.find(r => r.id === selectedReading1);
  const reading2 = readings.find(r => r.id === selectedReading2);

  const handleExportComparison = () => {
    if (!reading1 || !reading2 || !comparison) return;

    const comparisonData = {
      reading1: {
        spreadType: reading1.spreadType,
        cards: reading1.cards,
        interpretation: reading1.interpretation,
        timestamp: new Date(reading1.timestamp).toLocaleString(),
      },
      reading2: {
        spreadType: reading2.spreadType,
        cards: reading2.cards,
        interpretation: reading2.interpretation,
        timestamp: new Date(reading2.timestamp).toLocaleString(),
      },
      analysis: comparison,
    };

    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reading-comparison-${Date.now()}.json`;
    link.click();
  };

  const handleGenerateAnalysis = async () => {
    if (!reading1 || !reading2) return;
    
    // Create cache key from reading IDs
    const cacheKey = `${selectedReading1}-${selectedReading2}`;
    
    // Check cache first
    if (analysisCache[cacheKey]) {
      setAiAnalysis(analysisCache[cacheKey]);
      setAnalysisError('');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisError('');
    try {
      const result = await analyzeReadingMutation.mutateAsync({
        reading1: {
          cards: reading1.cards,
          spreadType: reading1.spreadType,
          interpretation: reading1.interpretation,
        },
        reading2: {
          cards: reading2.cards,
          spreadType: reading2.spreadType,
          interpretation: reading2.interpretation,
        },
      });
      setAiAnalysis(result.analysis);
      // Cache the result
      setAnalysisCache(prev => ({ ...prev, [cacheKey]: result.analysis }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate analysis. Please try again.';
      setAnalysisError(errorMessage);
      console.error('Failed to analyze readings:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/readings')}
              className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
            </button>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              READING COMPARISON
            </h1>
          </div>
          <button
            onClick={handleExportComparison}
            disabled={!reading1 || !reading2}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-400 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Reading Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              First Reading
            </label>
            <select
              value={selectedReading1}
              onChange={(e) => setSelectedReading1(e.target.value)}
              className="w-full bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select a reading...</option>
              {readings.map((reading) => (
                <option key={reading.id} value={reading.id}>
                  {reading.spreadType} - {new Date(reading.timestamp).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-400 mb-2">
              Second Reading
            </label>
            <select
              value={selectedReading2}
              onChange={(e) => setSelectedReading2(e.target.value)}
              className="w-full bg-slate-900/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-400"
            >
              <option value="">Select a reading...</option>
              {readings.map((reading) => (
                <option key={reading.id} value={reading.id}>
                  {reading.spreadType} - {new Date(reading.timestamp).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Analysis */}
        {comparison && reading1 && reading2 && (
          <>
            {/* Analysis Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-xs text-cyan-400 font-semibold mb-1">MATCHING CARDS</div>
                <div className="text-2xl font-bold text-cyan-400">{comparison.sameCards}</div>
              </div>
              <div className="bg-slate-900/50 border border-pink-500/30 rounded-lg p-4">
                <div className="text-xs text-pink-400 font-semibold mb-1">DIFFERENT CARDS</div>
                <div className="text-2xl font-bold text-pink-400">{comparison.differentCards}</div>
              </div>
              <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-xs text-yellow-400 font-semibold mb-1">SAME ORIENTATION</div>
                <div className="text-2xl font-bold text-yellow-400">{comparison.sameOrientations}</div>
              </div>
              <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-xs text-purple-400 font-semibold mb-1">DIFFERENT ORIENTATION</div>
                <div className="text-2xl font-bold text-purple-400">{comparison.differentOrientations}</div>
              </div>
            </div>

            {/* Side-by-Side Readings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reading 1 */}
              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">
                  {reading1.spreadType.toUpperCase()}
                </h2>
                <div className="mb-4">
                  <div className="text-xs text-cyan-400/60 mb-2">
                    {new Date(reading1.timestamp).toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    {reading1.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-800/50 rounded px-3 py-2"
                      >
                        <span className="text-sm text-white">{card.name}</span>
                        <span
                          className={`text-xs font-semibold ${
                            card.isReversed ? 'text-pink-400' : 'text-cyan-400'
                          }`}
                        >
                          {card.isReversed ? '⬇ REVERSED' : '⬆ UPRIGHT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded p-3 text-sm text-gray-300">
                  <p className="line-clamp-4">{reading1.interpretation}</p>
                </div>
              </div>

              {/* Reading 2 */}
              <div className="bg-slate-900/50 border border-pink-500/30 rounded-lg p-6">
                <h2 className="text-xl font-bold text-pink-400 mb-4">
                  {reading2.spreadType.toUpperCase()}
                </h2>
                <div className="mb-4">
                  <div className="text-xs text-pink-400/60 mb-2">
                    {new Date(reading2.timestamp).toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    {reading2.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-800/50 rounded px-3 py-2"
                      >
                        <span className="text-sm text-white">{card.name}</span>
                        <span
                          className={`text-xs font-semibold ${
                            card.isReversed ? 'text-pink-400' : 'text-cyan-400'
                          }`}
                        >
                          {card.isReversed ? '⬇ REVERSED' : '⬆ UPRIGHT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded p-3 text-sm text-gray-300">
                  <p className="line-clamp-4">{reading2.interpretation}</p>
                </div>
              </div>
            </div>

            {/* Full Interpretations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">INTERPRETATION</h3>
                <p className="text-gray-300 leading-relaxed">{reading1.interpretation}</p>
              </div>
              <div className="bg-slate-900/50 border border-pink-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-pink-400 mb-4">INTERPRETATION</h3>
                <p className="text-gray-300 leading-relaxed">{reading2.interpretation}</p>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="mt-8">
              <button
                onClick={handleGenerateAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold mb-4"
              >
                <Sparkles className="w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
              </button>

              {analysisError && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">Analysis Failed</h4>
                    <p className="text-red-300/80 text-sm">{analysisError}</p>
                    <button
                      onClick={handleGenerateAnalysis}
                      disabled={isAnalyzing}
                      className="mt-2 text-sm text-red-400 hover:text-red-300 underline disabled:opacity-50"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {aiAnalysis && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    MYSTICAL INSIGHTS
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{aiAnalysis}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!reading1 || !reading2 ? (
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-12 text-center">
            <p className="text-gray-400">
              Select two readings from the dropdowns above to compare them side-by-side
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
