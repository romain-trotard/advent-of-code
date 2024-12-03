export async function getFileLines(filePath: string) {
    const input = Bun.file(filePath);
    const fileContent = await input.text();

    return fileContent.split('\n').filter(line => line.trim() !== '');
}

