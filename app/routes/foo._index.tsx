import MyComp from "~/components/my-comp";

export default function FooIndex() {
    return (
        <div>
            <h1>Foo</h1>
            <MyComp givenName={"John"} surName={"Doe"} />
        </div>
    );
}