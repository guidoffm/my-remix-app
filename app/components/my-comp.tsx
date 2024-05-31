export default function MyComp({ displayName }: { displayName: string }) {
    return (
        <div>
            <h2 className="h2">Hello {displayName}!</h2>
        </div>
    );
}