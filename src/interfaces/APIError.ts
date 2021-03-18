export default interface API_Error
{
    error_id: string;
    errors: [
        {
            code: number
            message: string
        }
    ]
}