export default function DateFromNumber({ number }: { number: number | undefined }) {
    return (
        <>{number ? new Date(number).toLocaleString() : ''}</>
    );
}