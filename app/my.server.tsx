export default async function my() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "Hello from my.server.tsx!";
}