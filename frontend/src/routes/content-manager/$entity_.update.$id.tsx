import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useForm } from '@tanstack/react-form';
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/content-manager/$entity/update/$id')({
    component: UpdateEntryComponent,
    loader: async ({ params }) => {
        const schemaData = await getSchema(params.entity);
        const tableData = await getTableData(params.entity, params.id);
        return { schemaData, tableData };
    }
})

async function getSchema(entity: string) {
    const res = await fetch("http://127.0.0.1:3000/api/entity/getTableSchema", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entity })
    })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }
    data.columns.shift()
    data.dataTypes.shift()

    return data
}

async function getTableData(entity: string, id: string) {
    const res = await fetch("http://127.0.0.1:3000/api/content/readFromTableById", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entity, "id": id })
    })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }

    return data
}

type SchemaDataType = {
    columns: Array<string>,
    dataTypes: Array<string>
};

type TableDataType = {
    data: [{}]
}

function UpdateEntryComponent() {
    const { entity, id } = Route.useParams();
    const { schemaData, tableData }: { schemaData: SchemaDataType, tableData: TableDataType } = Route.useLoaderData();

    const form = useForm({
        defaultValues: schemaData.columns,
        onSubmit: async ({ value }) => {
            // await new Promise(h => setTimeout(h, 2000))
            const attributes = new Object();
            for (const [key, val] of Object.entries(value)) {
                const att_name = key as string;
                const att_value = val as string;
                if (schemaData.columns.includes(att_name)) {
                    // @ts-ignore
                    attributes[att_name] = att_value
                }
            }

            for (let i = 0; i < schemaData.columns.length; i++) {
                const val = schemaData.columns[i];
                if (!Object.keys(attributes).includes(val)) {
                    // @ts-ignore
                    attributes[val] = tableData.data[0][val]
                }
            }

            const res = await fetch("http://127.0.0.1:3000/api/content/updateInTable", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "table_name": entity, id, attributes })
            })
            if (!res.ok) return toast({ title: "Error", description: "An error has occurred" })
            const data = await res.json()
            if (data.error) return toast({ title: "Error", description: "An error has occurred" })

            return toast({ title: "Success", description: "Updated entry!" })
        },
    })

    function getType(name: string) {
        if (name === "numeric") return "number"
        else if (name === "text") return "text"
        else if (name === "date") return "date"
        else return "text"
    }

    return (
        <div className='flex flex-col gap-2 p-8'>
            <Link to='/content-manager/$entity' params={{ entity }} className='flex gap-2 text-primary'><ArrowLeft />Back</Link>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className='w-full flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-4xl font-medium'>Update an entry</span>
                        <span className='text-sm mt-1'>ENTITY NAME: {entity}</span>
                    </div>

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        )}
                    />
                </div>

                <Card className='max-w-4xl mt-12 grid grid-cols-2 gap-6 p-6'>
                    {
                        schemaData.columns.map((name, index) => {
                            return <div key={index}>
                                <span>{name}</span>
                                <form.Field
                                    // @ts-ignore
                                    name={name}
                                    children={(field) => (
                                        <Input
                                            name={field.name}
                                            type={getType(schemaData.dataTypes[index])}
                                            // @ts-ignore
                                            defaultValue={tableData.data[0][field.name]}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    )}
                                />
                            </div>
                        })
                    }
                </Card>
            </form>
        </div >
    )
}
