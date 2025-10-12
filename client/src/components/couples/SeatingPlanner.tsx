import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Users, Table as TableIcon, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Guest {
  id: string;
  name: string;
  email: string;
  group?: string;
  dietaryRestrictions?: string;
  tableId?: string;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  guests: Guest[];
}

interface SeatingPlannerProps {
  onSeatingChange?: (tables: Table[], unassignedGuests: Guest[]) => void;
}

export default function SeatingPlanner({ onSeatingChange }: SeatingPlannerProps) {
  const [tables, setTables] = useState<Table[]>([
    { id: 'table-1', name: 'Table 1', capacity: 8, x: 100, y: 100, guests: [] },
    { id: 'table-2', name: 'Table 2', capacity: 8, x: 300, y: 100, guests: [] },
    { id: 'table-3', name: 'Table 3', capacity: 8, x: 500, y: 100, guests: [] },
    { id: 'table-4', name: 'Table 4', capacity: 8, x: 100, y: 300, guests: [] },
    { id: 'table-5', name: 'Table 5', capacity: 8, x: 300, y: 300, guests: [] },
    { id: 'table-6', name: 'Table 6', capacity: 8, x: 500, y: 300, guests: [] },
  ]);

  const [unassignedGuests, setUnassignedGuests] = useState<Guest[]>([
    { id: 'guest-1', name: 'John Smith', email: 'john@example.com', group: 'Family' },
    { id: 'guest-2', name: 'Jane Doe', email: 'jane@example.com', group: 'Friends' },
    { id: 'guest-3', name: 'Robert Johnson', email: 'robert@example.com', group: 'Work' },
    { id: 'guest-4', name: 'Maria Garcia', email: 'maria@example.com', group: 'Family' },
    { id: 'guest-5', name: 'David Wilson', email: 'david@example.com', group: 'Friends' },
    { id: 'guest-6', name: 'Sarah Brown', email: 'sarah@example.com', group: 'Family' },
    { id: 'guest-7', name: 'Michael Davis', email: 'michael@example.com', group: 'Work' },
    { id: 'guest-8', name: 'Lisa Anderson', email: 'lisa@example.com', group: 'Friends' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter guests based on search and group
  const filteredGuests = unassignedGuests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || guest.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Get unique groups
  const groups = Array.from(new Set(unassignedGuests.map(guest => guest.group || 'Other')));

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) return;

    // Moving from unassigned to table
    if (sourceId === 'unassigned-guests') {
      const guest = unassignedGuests[source.index];
      const targetTable = tables.find(table => table.id === destId);
      
      if (!targetTable) return;
      if (targetTable.guests.length >= targetTable.capacity) {
        alert(`Table ${targetTable.name} is full!`);
        return;
      }

      // Remove from unassigned
      setUnassignedGuests(prev => prev.filter(g => g.id !== guest.id));
      
      // Add to table
      setTables(prev => prev.map(table => 
        table.id === destId 
          ? { ...table, guests: [...table.guests, { ...guest, tableId: destId }] }
          : table
      ));
    }
    // Moving from table to unassigned
    else if (destId === 'unassigned-guests') {
      const sourceTable = tables.find(table => table.id === sourceId);
      if (!sourceTable) return;
      
      const guest = sourceTable.guests[source.index];
      
      // Remove from table
      setTables(prev => prev.map(table => 
        table.id === sourceId 
          ? { ...table, guests: table.guests.filter(g => g.id !== guest.id) }
          : table
      ));
      
      // Add to unassigned
      setUnassignedGuests(prev => [...prev, { ...guest, tableId: undefined }]);
    }
    // Moving from table to table
    else {
      const sourceTable = tables.find(table => table.id === sourceId);
      const targetTable = tables.find(table => table.id === destId);
      
      if (!sourceTable || !targetTable) return;
      if (targetTable.guests.length >= targetTable.capacity) {
        alert(`Table ${targetTable.name} is full!`);
        return;
      }
      
      const guest = sourceTable.guests[source.index];
      
      setTables(prev => prev.map(table => {
        if (table.id === sourceId) {
          return { ...table, guests: table.guests.filter(g => g.id !== guest.id) };
        }
        if (table.id === destId) {
          return { ...table, guests: [...table.guests, { ...guest, tableId: destId }] };
        }
        return table;
      }));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    let csvContent = 'Table,Guest Name,Email,Group,Dietary Restrictions\n';
    
    tables.forEach(table => {
      table.guests.forEach(guest => {
        csvContent += `"${table.name}","${guest.name}","${guest.email}","${guest.group || ''}","${guest.dietaryRestrictions || ''}"\n`;
      });
    });
    
    // Add unassigned guests
    unassignedGuests.forEach(guest => {
      csvContent += `"Unassigned","${guest.name}","${guest.email}","${guest.group || ''}","${guest.dietaryRestrictions || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating-plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fetch guests from API (simulated)
  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch from /api/guests
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save seating arrangement
  const saveSeatingPlan = async () => {
    try {
      // In real implementation, save to backend
      const seatingData = {
        tables: tables.map(table => ({
          ...table,
          guestIds: table.guests.map(g => g.id)
        })),
        unassignedGuestIds: unassignedGuests.map(g => g.id)
      };
      
      console.log('Saving seating plan:', seatingData);
      // await fetch('/api/seating-plan', { method: 'POST', body: JSON.stringify(seatingData) });
    } catch (error) {
      console.error('Failed to save seating plan:', error);
    }
  };

  // Notify parent of changes
  useEffect(() => {
    onSeatingChange?.(tables, unassignedGuests);
    saveSeatingPlan();
  }, [tables, unassignedGuests]);

  const totalGuests = tables.reduce((sum, table) => sum + table.guests.length, 0) + unassignedGuests.length;
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Seating Planner</h2>
        <p className="text-gray-600">Drag and drop guests to arrange your perfect seating plan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{totalGuests}</div>
            <div className="text-sm text-gray-600">Total Guests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TableIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{tables.length}</div>
            <div className="text-sm text-gray-600">Tables</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalCapacity}</div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{unassignedGuests.length}</div>
            <div className="text-sm text-gray-600">Unassigned</div>
          </CardContent>
        </Card>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Guest List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guest List</span>
                  <Button size="sm" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search guests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="all">All Groups</option>
                    {groups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              
              <CardContent>
                <Droppable droppableId="unassigned-guests">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[200px] p-2 rounded transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-dashed border-gray-200'
                      }`}
                    >
                      {filteredGuests.map((guest, index) => (
                        <Draggable key={guest.id} draggableId={guest.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move transition-all ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                              }`}
                            >
                              <div className="font-medium text-sm">{guest.name}</div>
                              <div className="text-xs text-gray-500">{guest.group}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {filteredGuests.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          {searchTerm || selectedGroup !== 'all' ? 'No guests match your filters' : 'All guests are assigned'}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          {/* Seating Layout */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Seating Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-50 rounded-lg p-4 min-h-[600px] overflow-auto">
                  <svg width="100%" height="500" className="absolute inset-0">
                    {/* Stage/Altar representation */}
                    <rect x="250" y="20" width="200" height="40" fill="#e11d48" rx="8" />
                    <text x="350" y="45" textAnchor="middle" className="fill-white text-sm font-medium">
                      Stage/Altar
                    </text>
                  </svg>
                  
                  {/* Tables Grid */}
                  <div className="grid grid-cols-3 gap-8 pt-20">
                    {tables.map((table) => (
                      <div key={table.id} className="flex flex-col items-center">
                        <div className="text-sm font-medium mb-2">{table.name}</div>
                        <Droppable droppableId={table.id}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`w-32 h-32 rounded-full border-4 p-2 transition-all ${
                                snapshot.isDraggingOver 
                                  ? 'border-blue-400 bg-blue-50' 
                                  : table.guests.length >= table.capacity
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              <div className="h-full overflow-y-auto">
                                {table.guests.map((guest, index) => (
                                  <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`text-xs p-1 mb-1 bg-white border rounded cursor-move ${
                                          snapshot.isDragging ? 'shadow-lg' : ''
                                        }`}
                                      >
                                        {guest.name.split(' ')[0]}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                              <div className="text-xs text-center text-gray-500 mt-1">
                                {table.guests.length}/{table.capacity}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DragDropContext>

      {/* Instructions */}
      <Alert className="mt-6">
        <AlertDescription>
          <strong>Instructions:</strong> Drag guests from the sidebar to tables, or between tables. 
          Use search and group filters to find specific guests quickly. 
          Tables will highlight when full (red border) or when dragging over them (blue border).
        </AlertDescription>
      </Alert>
    </div>
  );
}