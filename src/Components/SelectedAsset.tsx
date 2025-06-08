import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

type MinimalData = {
  noradCatId: string;
  name: string;
};

export const SelectedAssets = () => {
  const navigate = useNavigate();
  const [selectedAssets, setSelectedAssets] = useState<MinimalData[]>([]);

  useEffect(() => {
    const savedSelection = localStorage.getItem('selectedAssetsMinimal');
    if (savedSelection) {
      setSelectedAssets(JSON.parse(savedSelection));
    }
  }, []);

  const clearSelection = () => {
    localStorage.removeItem('selectedAssets');
    localStorage.removeItem('selectedAssetsMinimal');
    setSelectedAssets([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Selected Assets</h1>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Back to List
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {selectedAssets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No assets selected</p>
              <Button variant="outlined"   onClick={() => navigate(-1)} className="mt-4" >
                Select Assets
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg">
                  Showing {selectedAssets.length} selected assets
                </p>
                <Button   variant="outlined"  color="error" onClick={clearSelection}  >
                  Clear Selection
                </Button>
              </div> 
              <div className="border rounded shadow-sm overflow-auto">
                <div className="grid grid-cols-2 bg-gray-200 font-semibold sticky top-0 z-10 text-sm">
                  <div className="border px-2 py-2">Norad ID</div>
                  <div className="border px-2 py-2">Name</div>
                </div>

                <div className="h-[500px] overflow-auto">
                  {selectedAssets.map((asset) => (
                    <div  key={asset.noradCatId} className="grid grid-cols-2 text-sm border-b hover:bg-gray-50" >
                      <div className="border px-2 py-2 truncate">{asset.noradCatId}</div>
                      <div className="border px-2 py-2 truncate">{asset.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};