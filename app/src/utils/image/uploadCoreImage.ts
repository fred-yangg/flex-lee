import stream from "stream";
import uploadImage from "./uploadImage";
import query from "../../db";
import getReadableStreamHash from "../stream/getReadableStreamHash";


export default async function uploadCoreImage(command: string, getImageStream: () => Promise<stream.Readable>) {

    const checksum = await getReadableStreamHash(await getImageStream())

    const checksumResponse =  await query(`SELECT checksum FROM core_images WHERE command=$1 AND checksum=$2`, [
        command,
        checksum
    ])

    if (checksumResponse.rowCount > 0) {
        return `The binding was unsuccessful as the image you uploaded had already been bound to the command "${command}"`
    }

    const response = await uploadImage(await getImageStream())

    await query('INSERT INTO core_images VALUES ($1,$2,$3,$4,$5,$6,$7)', [
        command,
        response.get('size'),
        response.get('filename'),
        response.get('ext'),
        response.get('image'),
        response.get('delete'),
        checksum
    ])
    return `Image successfully uploaded to "${command}" command.`
}