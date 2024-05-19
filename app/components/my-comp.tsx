export default function MyComp({ givenName, surName }: { givenName: string, surName: string }) {
    return (
        <div>
            <h1>Hello {givenName} {surName}</h1>
        </div>
    );
}