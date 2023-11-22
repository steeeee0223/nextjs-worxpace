module.exports = function (
    /** @type {import('plop').NodePlopAPI} */
    plop
) {

    plop.setGenerator("action", {
        description: "Nextjs Server Actions",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Action Name: ",
                default: "create-action",
                validate: (value) => {
                    if (!value) {
                        return `App name is required`;
                    }
                    return true;
                },

            }
        ],
        actions: [
            {
                type: "addMany",
                destination: "actions/{{dashCase name}}",
                templateFiles: "templates/actions/",
                base: "templates/actions",
                abortOnFail: true,
            },
            {
                type: "append",
                path: "actions/index.ts",
                template: 'export * from "./{{dashCase name}}";',
            }
        ],
    });
}
