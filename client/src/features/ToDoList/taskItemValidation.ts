import * as yup from 'yup';

// yup.addMethod(yup.array, 'unique', function (message, mapper = (a: any) => a) {
//     return this.test('unique', message, function (list) {
//         return list!.length === new Set(list!.map(mapper)).size;
//     });
// });

export const validationSchema = yup.object({
    taskName: yup.string().required("Task Name is required."),
    label: yup.array().of(yup.string()).test('unique', 'Labels must be unique.', (value) => value!.length === new Set(value).size),
})
