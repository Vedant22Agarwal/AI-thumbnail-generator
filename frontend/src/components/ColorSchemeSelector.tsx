import { colorSchemes } from '../../public/assets/assets.ts';

const ColorSchemeSelector = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    return (
        <>
            <div className="space-y-3">
                <label className='block text-sm font-medium text-zinc-200'>Color Scheme</label>
                <div className="grid grid-cols-6 gap-3">
                    {colorSchemes.map((scheme) => (
                        <button className={`relative rounded-lg transition-all ${value === scheme.id && "ring-2 ring-pink-500"}`}
                            key={scheme.id} onClick={() => onChange(scheme.id)}
                            title={scheme.name}>
                            <div className="flex h-10 rounded-lg overflow-hidden">
                                {scheme.colors.map((color,i) => (
                                    <div className="flex-1" key={i} style={{backgroundColor : color}}/>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
                <p className='text-xs text-zinc-400'>Selected: {colorSchemes.find((s) => s.id === value)?.name}</p>
            </div>
        </>
    )
}

export default ColorSchemeSelector