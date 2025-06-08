import React from "react";

type Props = {
  data: {
    objectType: string;
  }[];
  type: string;
};

const ObjectTypeCounter: React.FC<Props> = ({ data, type }) => {
  const count = data.filter((item) => item.objectType === type).length;
  return (
    <div className="bg-blue-50 rounded-lg p-3 text-center transition-all hover:shadow-md">
    <p className="text-sm text-gray-500">{type}</p>
    <p className="text-2xl font-bold text-blue-600">{count}</p>
  </div>
  
  );
};

export default ObjectTypeCounter;
