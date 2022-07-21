import * as yup from 'yup';

export const validationSchema = yup.object({
    taskName: yup.string().required("Task Name is required.")
})