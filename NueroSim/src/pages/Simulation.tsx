
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Simulation = Database["public"]["Tables"]["simulations"]["Row"];

const models = [
  { value: "lif", label: "Leaky Integrate-and-Fire (LIF)" },
  { value: "izhikevich", label: "Izhikevich" },
];

const Simulation = () => {
  const [selectedModel, setSelectedModel] = useState("lif");
  const [resistance, setResistance] = useState("10");
  const [capacitance, setCapacitance] = useState("1");
  const [simulationData, setSimulationData] = useState<any>(null);
  const [history, setHistory] = useState<Simulation[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchSimulationHistory(user.id);
      }
    };
    fetchUser();
  }, []);

  const fetchSimulationHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch simulation history");
      console.error('Error fetching simulation history:', error);
    } else {
      setHistory(data || []);
    }
  };

  const runSimulation = async () => {
    if (!user) {
      toast.error("Please log in to run simulations");
      return;
    }

    // Mock simulation data
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      time: i * 0.1,
      voltage: Math.sin(i * 0.1) * Math.exp(-i * 0.05) + Math.random() * 0.2,
    }));

    setSimulationData(mockData);

    const { error } = await supabase
      .from('simulations')
      .insert({
        user_id: user.id,
        model: selectedModel,
        resistance: Number(resistance),
        capacitance: Number(capacitance),
        data: mockData,
      });

    if (error) {
      toast.error("Failed to save simulation");
      console.error('Error saving simulation:', error);
    } else {
      toast.success("Simulation saved!");
      fetchSimulationHistory(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Neuron Simulation</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Type</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resistance (MΩ)</label>
                <Input
                  type="number"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Capacitance (nF)</label>
                <Input
                  type="number"
                  value={capacitance}
                  onChange={(e) => setCapacitance(e.target.value)}
                />
              </div>

              <Button onClick={runSimulation} className="w-full bg-purple-600 hover:bg-purple-700">
                Run Simulation
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationData && (
                <div className="overflow-x-auto">
                  <LineChart width={600} height={300} data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: "Time (ms)", position: "bottom" }} />
                    <YAxis label={{ value: "Membrane Potential (mV)", angle: -90, position: "left" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="voltage" stroke="#9b87f5" dot={false} />
                  </LineChart>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Simulation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium">{models.find(m => m.value === entry.model)?.label}</p>
                    <p className="text-sm text-gray-500">{entry.timestamp}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSimulationData(entry.data)}>
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulation;
