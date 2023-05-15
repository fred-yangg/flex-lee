import axios from "axios"
import vgy from '../config/vgy.json'
import FormData from 'form-data'
import stream from "stream";

export default async function vgyUpload(image: stream.Readable): Promise<Map<string, any>> {
    const url: string = "https://vgy.me/upload"
    const data = new FormData()

    data.append('file', image)
    data.append('userkey', vgy.api_key)

    const response = await axios.postForm(
        url,
        data
    )

    return new Map(Object.entries(response.data))
}
