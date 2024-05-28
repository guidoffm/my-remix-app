export default function CheckboxFromBoolean({ value, onChange }: { value: boolean | undefined, onChange?: (value: boolean) => void }) {
    return (
        <input
            type="checkbox"
            checked={value}
            onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
            readOnly
        />
    );
}