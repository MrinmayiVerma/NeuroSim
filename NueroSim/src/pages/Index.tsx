
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            NeuroSim
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A powerful neuron simulation tool for students and researchers in computational neurobiology
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Multiple Models</h3>
              <p className="text-gray-600">Choose from LIF, Izhikevich, and other neuron models</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Real-time Simulation</h3>
              <p className="text-gray-600">Visualize neuron behavior with interactive charts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Save & Share</h3>
              <p className="text-gray-600">Keep track of your simulations and findings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
