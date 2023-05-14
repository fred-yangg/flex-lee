import stream from "stream";
import crypto from "crypto";

export default async function getReadableStreamHash(readableStream: stream.Readable, algorithm: string = 'sha256') {
    return new Promise<string>(resolve => {
        const hash = crypto.createHash(algorithm)
            .setEncoding('hex')

        hash.on('finish', () => {
            resolve(hash.read())
        })

        readableStream.pipe(hash)
    })
}