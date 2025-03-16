import { useState } from 'react';

interface TableLayoutProps {
  selectedTables: string[];
  onTableSelect: (tableNumber: string) => void;
  date: string;
  time: string;
}

interface TableStatus {
  [key: string]: {
    isBooked: boolean;
    date?: string;
    time?: string;
  };
}

const TableLayout: React.FC<TableLayoutProps> = ({
  selectedTables,
  onTableSelect,
  date,
  time
}) => {
  // Get booked tables from localStorage
  const getBookedTables = (): TableStatus => {
    const bookedTables = localStorage.getItem('bookedTables');
    return bookedTables ? JSON.parse(bookedTables) : {};
  };

  const [bookedTables] = useState<TableStatus>(getBookedTables());

  const isTableBooked = (tableNumber: string) => {
    return bookedTables[tableNumber]?.isBooked &&
           bookedTables[tableNumber]?.date === date &&
           bookedTables[tableNumber]?.time === time;
  };

  const handleTableClick = (tableNumber: string) => {
    if (!isTableBooked(tableNumber)) {
      onTableSelect(tableNumber);
    }
  };

  const getTableClass = (tableNumber: string) => {
    const baseClass = "w-16 h-16 rounded-lg m-2 flex items-center justify-center cursor-pointer transition-all duration-200 text-sm font-medium";
    
    if (isTableBooked(tableNumber)) {
      return `${baseClass} bg-gray-300 cursor-not-allowed text-gray-500`;
    }
    
    if (selectedTables.includes(tableNumber)) {
      return `${baseClass} bg-green-500 text-white transform scale-105 shadow-lg`;
    }
    
    return `${baseClass} bg-white border-2 border-gray-200 hover:border-green-500 text-gray-700`;
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Table Layout</h3>
        <p className="text-sm text-gray-600">Click to select tables. Selected tables will be highlighted.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="w-24 h-8 bg-red-600 rounded-t-lg flex items-center justify-center text-white text-sm">
          Entrance
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {/* Row 1 */}
        <div className="col-span-5 flex justify-center space-x-4">
          {['A1', 'A2', 'A3', 'A4', 'A5'].map((table) => (
            <button
              key={table}
              onClick={() => handleTableClick(table)}
              className={getTableClass(table)}
              disabled={isTableBooked(table)}
            >
              {table}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="col-span-5 flex justify-center space-x-4">
          {['B1', 'B2', 'B3', 'B4', 'B5'].map((table) => (
            <button
              key={table}
              onClick={() => handleTableClick(table)}
              className={getTableClass(table)}
              disabled={isTableBooked(table)}
            >
              {table}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="col-span-5 flex justify-center space-x-4">
          {['C1', 'C2', 'C3', 'C4', 'C5'].map((table) => (
            <button
              key={table}
              onClick={() => handleTableClick(table)}
              className={getTableClass(table)}
              disabled={isTableBooked(table)}
            >
              {table}
            </button>
          ))}
        </div>

        {/* Row 4 */}
        <div className="col-span-5 flex justify-center space-x-4">
          {['D1', 'D2', 'D3', 'D4', 'D5'].map((table) => (
            <button
              key={table}
              onClick={() => handleTableClick(table)}
              className={getTableClass(table)}
              disabled={isTableBooked(table)}
            >
              {table}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-white border-2 border-gray-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default TableLayout; 