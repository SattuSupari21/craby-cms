import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

export const Route = createFileRoute('/content-types/$entity/create')({
    component: UpdateEntityComponent
})

const constraints = [
    {
        value: "unique",
        text: "Unique",
        description: "You won't be able to create an entry if there is an existing entry with identical content"
    },
    {
        value: "notNull",
        text: "Not Null",
        description: "You won't be able to create an entry if this field is empty"
    }
];

function UpdateEntityComponent() {
    const newEntity = {
        entityName: "",
        fieldName: "",
        attributes: {}
    }

    const { entity } = Route.useParams();
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [defaultValue, setDefaultValue] = useState("");
    const [newEntityConstraints, setNewEntityConstraints] = useState({
        "unique": false,
        "notNull": false,
        "default": null
    })

    const handleChange = (val: string) => {
        let updatedValue = {};
        // @ts-ignore
        updatedValue = { [val]: !newEntityConstraints[val] };
        setNewEntityConstraints(newEntityConstraints => ({
            ...newEntityConstraints,
            ...updatedValue
        }));
    }

    const handleNewEntity = async () => {
        newEntity.entityName = entity;
        newEntity.fieldName = fieldName;
        newEntity.attributes = {
            [fieldName]: newEntityConstraints
        }
        // @ts-ignore
        newEntity.attributes[fieldName].type = fieldType;
        // @ts-ignore
        newEntity.attributes[fieldName].default = defaultValue;
        console.log(newEntity)

        const res = await fetch("http://127.0.0.1:3000/api/entity/updateTable", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entityName: newEntity.entityName, colName: newEntity.fieldName, attributes: newEntity.attributes })
        })
        if (!res.ok) return toast({ title: "Error", description: "An error has occurred" })
        const data = await res.json()
        if (data.error) return toast({ title: "Error", description: "An error has occurred" })

        return toast({ title: "Success", description: "Added new entry!" })

    }

    return (
        <div className='flex flex-col gap-2 p-8'>
            <Link to='/content-types/$entity' params={{ entity }} className='flex gap-2 text-primary'><ArrowLeft />Back</Link>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Add another field</span>
                    <span className='text-sm mt-1'>Entity Name: {entity}</span>
                </div>
            </div>
            <Card className='max-w-2xl mt-12 flex flex-col gap-6 p-4'>
                <div className='flex flex-col gap-4 mt-2'>
                    <span>Create a new field for your entity</span>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <span>Name</span>
                            <Input type="text" onChange={(e) => setFieldName(e.target.value)} />
                        </div>
                        <div>
                            <span>Select type of field</span>
                            <Select onValueChange={(value) => setFieldType(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uuid">UUID</SelectItem>
                                    <SelectItem value="numeric">Numeric</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <span>Default value</span>
                            <Input type='text' onChange={(e) => setDefaultValue(e.target.value)} />
                        </div>
                        <div className='flex justify-between'>
                            {
                                constraints.map((val, index) => {
                                    return <div className='flex flex-col gap-2' key={index}>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox
                                                id={val.value}
                                                value={val.value}
                                                onCheckedChange={() => handleChange(val.value)} />
                                            <span>{val.text}</span>
                                        </div>
                                        <span className='text-sm'>{val.description}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <Button onClick={() => handleNewEntity()}>Finish</Button>
            </Card >
        </div >
    )
}
