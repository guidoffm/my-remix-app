export default function MyComp({ displayName }: { displayName: string }) {
    return (
        <div>
            <h1>Hello {displayName}!</h1>
        </div>
    );
}