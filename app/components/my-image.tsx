export default function MyImage({ imageid }: { imageid: string }) {
    return (
        <div style={{flexBasis: '16.66%', padding: '10px', boxSizing: 'border-box'  }}>
            <a href={`/image/${imageid}`} target="_blank">
                <img src={`/image/${imageid}`} alt="image-${imageid}" style={{ width: '100%', height: '100%' }} />
            </a>
        </div>
    );
}