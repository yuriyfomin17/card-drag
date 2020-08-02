import React, {useState} from 'react'
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import uuid from 'uuid-v4'

const itemsFromBackend = [
    {id: uuid(), content: 'First task'},
    {id: uuid(), content: 'Second task'}
]
const columnFromBackend =
    {
        [uuid()]: {
            name: 'Todo',
            items: itemsFromBackend
        }

    }
const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const {source, destination} = result;
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
        ...columns,
        [source.droppableId]: {
            ...column,
            items: copiedItems
        }
    })
}

export default function App() {
    const [columns, setColumns] = useState(columnFromBackend)

    return (

        <div>
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                {Object.entries(columns).map(([id, column]) => {
                    return (
                        <Droppable droppableId={id} key={id}>
                            {(provided, snapshot) => {
                                return (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                            padding: 4,
                                            width: 400,
                                            minHeight: 500
                                        }}
                                    >
                                        {column.items.map((item, index) => {
                                            return (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => {
                                                        return (
                                                            <div ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 {...provided.dragHandleProps}
                                                                 style={{
                                                                     userSelect: 'none',
                                                                     padding: 16,
                                                                     margin: '0 0 8px 0',
                                                                     minHeight: '50px',
                                                                     backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                                                     color: 'white',
                                                                     ...provided.draggableProps.style
                                                                 }}
                                                            >
                                                                {item.content}
                                                            </div>
                                                        )

                                                    }}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )
                            }}
                        </Droppable>
                    )
                })}

            </DragDropContext>

        </div>


    )
}