
import { useEffect, useState } from "react";
import ObjectTypeCounter from "./ObjectTypeCounter";
import {
  Autocomplete,
  TextField,
  Badge,
  CircularProgress, 
} from "@mui/material";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AssetTable from "./AssestTable";

export const Home = () => {
  const navigate = useNavigate();
  type Data = {
    noradCatId: string;
    intlDes: string;
    name: string;
    launchDate: string;
    decayDate: string | null;
    objectType: string;
    launchSiteCode: string;
    countryCode: string;
    orbitCode: string;
  };

  const [getData, setData] = useState<Data[]>([]);
  const [objectTypes, setObjectTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [showLimitError, setShowLimitError] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [filterTextInput, setFilterTextInput] = useState("");
  const [selectedObjectTypesInput, setSelectedObjectTypesInput] = useState<string[]>([]);
  const [selectedOrbitCodesInput, setSelectedOrbitCodesInput] = useState<string[]>([]);

  const [appliedFilterText, setAppliedFilterText] = useState("");
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<string[]>([]);
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState<string[]>([]);

  const orbitCodes = [
    "{LEO}","{LEO1}","{LEO2}","{LEO3}","{LEO4}","{MEO}",
    "{GEO}","{HEO}","{IGO}","{EGO}","{NSO}","{GTO}","{GHO}",
    "{HAO}","{MGO}","{LMO}","{UFO}","{ESO}","UNKNOWN",
  ]; 
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching data...");

      const response = await fetch(
        "https://backend.digantara.dev/v1/satellites?objectTypes=ROCKET%20BODY%2CDEBRIS&attributes=orbitCode%2CcountryCode%2ClaunchSiteCode%2CobjectType%2CintlDes%2CnoradCatId%2Cname%2ClaunchDate%2CdecayDate"
      );

      console.log("API response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API data:", data);

      if (data?.data) {
        setData(data.data); 
        const uniqueObjectTypes = Array.from(
          new Set(data.data.map((item: Data) => item.objectType))
        ).filter(Boolean) as string[];
        setObjectTypes(uniqueObjectTypes);
      } else {
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }; 
  useEffect(() => {
    if (getData.length === 0) {
      fetchData();
    }
  }, []); 
  useEffect(() => {
    setAppliedFilterText(filterTextInput);
    setSelectedObjectTypes(selectedObjectTypesInput);
    setSelectedOrbitCodes(selectedOrbitCodesInput);
  }, [filterTextInput, selectedObjectTypesInput, selectedOrbitCodesInput]);

  const filteredAssets = getData.filter((item) => {
    const matchesText =
      appliedFilterText.trim() === "" ||
      item.name.toLowerCase().includes(appliedFilterText.toLowerCase()) ||
      item.noradCatId.toLowerCase().includes(appliedFilterText.toLowerCase());

    const matchesObjectType =
      selectedObjectTypes.length === 0 ||
      selectedObjectTypes.includes(item.objectType);

    const matchesOrbitCode =
      selectedOrbitCodes.length === 0 ||
      selectedOrbitCodes.includes(item.orbitCode);

    return matchesText && matchesObjectType && matchesOrbitCode;
  });

  const getDataofTotal = getData.length;
  const activeFilterCount =
    (appliedFilterText.trim() !== "" ? 1 : 0) +
    selectedObjectTypes.length +
    selectedOrbitCodes.length;

  const handleRowSelectionChange = (newSelection: Record<string, boolean>) => {
    const selectedCount = Object.values(newSelection).filter(Boolean).length;
    if (selectedCount <= 10) {
      setRowSelection(newSelection);
      setShowLimitError(false);
    } else {
      setShowLimitError(true) 
    }
    
  }; 
  const selectedAssest = () => {
    const selectedItems = Object.keys(rowSelection)
      .filter((id) => rowSelection[id])
      .map((noradCatId) => {
        const item = getData.find((d) => d.noradCatId === noradCatId);
        return item
          ? {
              noradCatId: item.noradCatId,
              name: item.name,
              intlDes: item.intlDes,
              orbitCode: item.orbitCode,
              countryCode: item.countryCode,
              objectType: item.objectType,
            }
          : null;
      })
      .filter(Boolean);

    try {
      localStorage.setItem(
        "selectedAssetsMinimal",
        JSON.stringify(selectedItems)
      );
      navigate("/selectedAssests");
    } catch (e) {
      setStorageError(
        "Could not save selections to browser storage. Please try selecting fewer items."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create My Asset List
          </h1>
          <button
            onClick={selectedAssest}
            className="text-xl font-bold text-gray-800 mb-6 border rounded-sm px-2 bg-blue-500 text-white cursor-pointer"
            disabled={Object.keys(rowSelection).length === 0}>
            Selected Data ({Object.keys(rowSelection).length})
          </button>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-full bg-white rounded-xl shadow-md p-6">
            <div className="">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center transition-all hover:shadow-md">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getDataofTotal}
                  </p>
                </div>
                <ObjectTypeCounter data={getData} type="ROCKET BODY" />
                <ObjectTypeCounter data={getData} type="PAYLOAD" />
                <ObjectTypeCounter data={getData} type="UNKNOWN" />
                <ObjectTypeCounter data={getData} type="DEBRIS" />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <div className="w-full md:flex-grow">
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Filter by name or NORAD Cat ID"
                    value={filterTextInput}
                    onChange={(e) => setFilterTextInput(e.target.value)}
                    variant="outlined"
                    className="bg-gray-50"
                  />
                </div>

                <div className="w-full md:w-64">
                  <Autocomplete
                    multiple
                    size="small"
                    options={objectTypes}
                    value={selectedObjectTypesInput}
                    onChange={(e, v) => setSelectedObjectTypesInput(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Object Type"
                        variant="outlined"
                      />
                    )}
                    disableCloseOnSelect
                    filterSelectedOptions
                  />
                </div>

                <div className="w-full md:w-64">
                  <Autocomplete  multiple  size="small"  options={orbitCodes}  value={selectedOrbitCodesInput}  onChange={(e, v) => setSelectedOrbitCodesInput(v)}
                    renderInput={(params) => (  <TextField {...params}  label="Orbit Code"  variant="outlined" />
                    )}
                    disableCloseOnSelect
                    filterSelectedOptions
                  />
                </div> 
                <Badge
                  badgeContent={activeFilterCount}
                  color="primary"
                  invisible={activeFilterCount === 0}
                  className="transform hover:scale-110 transition-transform"
                >
                  <FilterListAltIcon
                    fontSize="medium"
                    className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  />
                </Badge>
              </div>

              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-gray-500"
                >
                  Showing {filteredAssets.length} of {getData.length} items
                </motion.div>
              )}
            </div>

            <div className="max-h-[calc(95vh-310px)]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <CircularProgress size={60} className="mb-4" />
                  <p className="text-gray-500">Loading satellite data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full bg-red-50 rounded-lg">
                  <div className="text-red-500 text-center">
                    <p className="text-lg font-medium mb-2">
                      Error loading data
                    </p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    {getData.length === 0
                      ? "No satellite data available"
                      : "No items match your filters"}
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                   <AssetTable data={getData} rowSelection={rowSelection} onRowSelectionChange={setRowSelection}/>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
