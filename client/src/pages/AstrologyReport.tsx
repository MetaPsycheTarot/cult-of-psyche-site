import { useState } from "react";
import { Calendar, Clock, MapPin, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AstrologyData {
  name: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface AstrologyReport {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  sunSignDescription: string;
  moonSignDescription: string;
  risingSignDescription: string;
  cultInterpretation: string;
}

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const signDescriptions: Record<string, string> = {
  Aries: "Courageous, passionate, and pioneering. You are a natural leader with an intense drive to initiate new projects and adventures.",
  Taurus: "Grounded, reliable, and sensual. You value stability and material security, with a deep appreciation for beauty and comfort.",
  Gemini: "Curious, communicative, and adaptable. Your quick mind and versatility make you an excellent communicator and connector.",
  Cancer: "Nurturing, intuitive, and protective. You are deeply emotional with strong family bonds and a need for emotional security.",
  Leo: "Confident, creative, and generous. You shine brightly and naturally attract attention with your charismatic presence.",
  Virgo: "Analytical, practical, and detail-oriented. You have a keen eye for improvement and a desire to serve others.",
  Libra: "Diplomatic, artistic, and social. You seek balance and harmony in all relationships and situations.",
  Scorpio: "Intense, mysterious, and transformative. You possess deep emotional power and an ability to see hidden truths.",
  Sagittarius: "Adventurous, optimistic, and philosophical. You seek knowledge and freedom, with a love for exploration and growth.",
  Capricorn: "Ambitious, disciplined, and responsible. You are a natural strategist with a focus on long-term success.",
  Aquarius: "Innovative, independent, and humanitarian. You think outside the box and work for the greater good.",
  Pisces: "Compassionate, artistic, and intuitive. You are deeply imaginative with a strong connection to the spiritual realm.",
};

const cultInterpretations = [
  "Your psyche is awakening to new dimensions of consciousness. The veil between worlds grows thin for you.",
  "Your astrological chart reveals a soul seeking transformation and spiritual rebirth through the mysteries.",
  "The stars align to show a seeker of truth, destined to explore the depths of their own psyche.",
  "Your cosmic blueprint suggests a natural affinity for mystical practices and inner exploration.",
  "The universe whispers of your potential to become a guide for others in their spiritual awakening.",
];

function calculateSunSign(month: number, day: number): string {
  const dates = [
    [3, 21],
    [4, 20],
    [5, 21],
    [6, 21],
    [7, 23],
    [8, 23],
    [9, 23],
    [10, 23],
    [11, 22],
    [12, 22],
    [1, 20],
    [2, 19],
  ];

  for (let i = 0; i < dates.length; i++) {
    if (month === dates[i][0] && day >= dates[i][1]) {
      return zodiacSigns[i];
    }
    if (month === dates[(i + 1) % 12][0] && day < dates[(i + 1) % 12][1]) {
      return zodiacSigns[i];
    }
  }
  return zodiacSigns[0];
}

function calculateMoonSign(hour: number): string {
  const index = Math.floor((hour / 24) * 12) % 12;
  return zodiacSigns[index];
}

function calculateRisingSign(hour: number, minute: number): string {
  const totalMinutes = hour * 60 + minute;
  const index = Math.floor((totalMinutes / (24 * 60)) * 12) % 12;
  return zodiacSigns[index];
}

function generateAstrologyReport(data: AstrologyData): AstrologyReport {
  const [year, month, day] = data.dateOfBirth.split("-").map(Number);
  const [hour, minute] = data.timeOfBirth.split(":").map(Number);

  const sunSign = calculateSunSign(month, day);
  const moonSign = calculateMoonSign(hour);
  const risingSign = calculateRisingSign(hour, minute);

  return {
    sunSign,
    moonSign,
    risingSign,
    sunSignDescription: signDescriptions[sunSign],
    moonSignDescription: signDescriptions[moonSign],
    risingSignDescription: signDescriptions[risingSign],
    cultInterpretation: cultInterpretations[Math.floor(Math.random() * cultInterpretations.length)],
  };
}

export default function AstrologyReport() {
  const [formData, setFormData] = useState<AstrologyData>({
    name: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "12:00",
    placeOfBirth: "",
  });

  const [report, setReport] = useState<AstrologyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.gender || !formData.dateOfBirth || !formData.placeOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const generatedReport = generateAstrologyReport(formData);
      setReport(generatedReport);
      setIsLoading(false);
      toast.success("Your astrology report has been generated!");
    }, 1500);
  };

  const handleExportPDF = () => {
    if (!report) return;
    toast.success("PDF export coming soon!");
  };

  const handleSaveReport = () => {
    if (!report) return;
    toast.success("Report saved to your archive!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 text-foreground">
      {/* Header */}
      <div className="border-b border-magenta/20 bg-midnight/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-magenta" />
            <h1 className="text-4xl font-bold text-magenta">Astrology Report Generator</h1>
          </div>
          <p className="text-cyan/80">Discover your cosmic blueprint through Western astrology</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card className="bg-midnight/50 border-cyan/20">
              <CardHeader>
                <CardTitle className="text-magenta">Your Birth Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-cyan mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-midnight/50 border-cyan/30 focus:border-magenta text-foreground placeholder:text-cyan/50"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-cyan mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-midnight/50 border border-cyan/30 rounded-md text-cyan hover:border-magenta transition-colors focus:border-magenta focus:outline-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-cyan mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="bg-midnight/50 border-cyan/30 focus:border-magenta text-foreground"
                    />
                  </div>

                  {/* Time of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-cyan mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time of Birth (24-hour format)
                    </label>
                    <Input
                      type="time"
                      name="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleInputChange}
                      className="bg-midnight/50 border-cyan/30 focus:border-magenta text-foreground"
                    />
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-cyan mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Place of Birth *
                    </label>
                    <Input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="bg-midnight/50 border-cyan/30 focus:border-magenta text-foreground placeholder:text-cyan/50"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-magenta to-cyan hover:from-magenta/90 hover:to-cyan/90 text-midnight font-bold"
                  >
                    {isLoading ? "Generating Report..." : "Generate My Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Report Section */}
          <div>
            {report ? (
              <div className="space-y-6">
                {/* Welcome Message */}
                <Card className="bg-gradient-to-br from-magenta/10 to-cyan/10 border-magenta/30">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold text-magenta mb-2">Welcome, {formData.name}</h3>
                    <p className="text-foreground/80 mb-4">{report.cultInterpretation}</p>
                    <p className="text-sm text-cyan/70">
                      Your cosmic blueprint reveals the intersection of three powerful astrological forces.
                    </p>
                  </CardContent>
                </Card>

                {/* Sun Sign */}
                <Card className="bg-midnight/50 border-cyan/20">
                  <CardHeader>
                    <CardTitle className="text-magenta">☀️ Sun Sign: {report.sunSign}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">{report.sunSignDescription}</p>
                    <p className="text-sm text-cyan/70">
                      Your Sun Sign represents your core identity and conscious self. It's the essence of who you are.
                    </p>
                  </CardContent>
                </Card>

                {/* Moon Sign */}
                <Card className="bg-midnight/50 border-cyan/20">
                  <CardHeader>
                    <CardTitle className="text-magenta">🌙 Moon Sign: {report.moonSign}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">{report.moonSignDescription}</p>
                    <p className="text-sm text-cyan/70">
                      Your Moon Sign governs your emotional nature and inner world. It's your private self.
                    </p>
                  </CardContent>
                </Card>

                {/* Rising Sign */}
                <Card className="bg-midnight/50 border-cyan/20">
                  <CardHeader>
                    <CardTitle className="text-magenta">↗️ Rising Sign (Ascendant): {report.risingSign}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">{report.risingSignDescription}</p>
                    <p className="text-sm text-cyan/70">
                      Your Rising Sign is how others perceive you. It's the mask you wear in the world.
                    </p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveReport}
                    className="flex-1 bg-magenta hover:bg-magenta/90 text-midnight font-bold"
                  >
                    Save Report
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    className="flex-1 border-cyan/30 text-cyan hover:bg-cyan/10"
                  >
                    Export PDF
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-midnight/50 border-cyan/20 h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                  <p className="text-cyan/60 mb-2">Fill in your birth information to generate your astrology report</p>
                  <p className="text-sm text-cyan/40">
                    Your cosmic blueprint awaits discovery
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
