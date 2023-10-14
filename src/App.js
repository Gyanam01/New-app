import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";

const itemsFromBackend = [
  { id: uuid(), content: "First task", priority: 1, userId: 1, title: "Task 1", tag: "Tag1" },
  { id: uuid(), content: "Second task", priority: 2, userId: 2, title: "Task 2", tag: "Tag2" },
]

const columnsFromBackend = {
  [uuid()]: {
    name: "Requested",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "To do",
    items: []
  },
  [uuid()]: {
    name: "In Progress",
    items: []
  },
  [uuid()]: {
    name: "Done",
    items: []
  },
  [uuid()]: {
    name: "Canceled",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};



function App() {
    const [columns, setColumns] = useState(columnsFromBackend);
    const addItemToColumn = (columnId, content, priority, userId, title, tag) => {
      const newColumn = { ...columns[columnId] };
    
      const newItem = { id: uuid(), content, priority, userId, title, tag }; // Add tag
      newColumn.items = [newItem, ...newColumn.items];
      setColumns({ ...columns, [columnId]: newColumn });
    };

  
    // Function to delete all items from the "Canceled" column
    const deleteAllItems = (columnId) => {
      const newColumn = { ...columns[columnId] };
      newColumn.items = [];
      setColumns({ ...columns, [columnId]: newColumn });
    };
  
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>
                  {column.name}{" "}
                  {column.name !== "Canceled" && (
                    <button
                    onClick={() => {
                      const content = window.prompt("Enter a task:");
                      if (content) {
                        const priority = parseInt(window.prompt("Enter priority (1, 2, 3, etc.):") || 1);
                        const userId = parseInt(window.prompt("Enter user ID:") || 1);
                        const title = window.prompt("Enter title:");
                        const tag = window.prompt("Enter tag:"); // Prompt for tag
                  
                        addItemToColumn(columnId, content, priority, userId, title, tag);
                      }
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "20px",
                      cursor: "pointer"
                    }}
                  >
                    +
                  </button>
                  
                  )}
                </h2>
  
                {column.name === "Canceled" && (
                  <button
                    onClick={() => {
                      deleteAllItems(columnId);
                    }}
                  >
                    Delete All Items
                  </button>
                )}
  
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
  key={item.id}
  draggableId={item.id}
  index={index}
>
  {(provided, snapshot) => {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          userSelect: "none",
          padding: 16,
          margin: "0 0 8px 0",
          minHeight: "50px",
          backgroundColor: snapshot.isDragging
            ? "#263B4A"
            : "#456C86",
          color: "white",
          ...provided.draggableProps.style
        }}
      >
        <div>
          {item.content}
        </div>
        <div>
          <strong style={{ fontSize: "small" }}>
            Priority: {item.priority}
          </strong>
        </div>
        <div>
          <strong style={{ fontSize: "small" }}>
            User ID: {item.userId}
          </strong>
        </div>
        <div>
          <strong style={{ fontSize: "small" }}>
            Title: {item.title}
          </strong>
        </div>
        <div>
          <strong style={{ fontSize: "small" }}>
            Tag: {item.tag}
          </strong>
        </div>
      </div>
    );
  }}
</Draggable>


                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    );
  }
  
  export default App;
  