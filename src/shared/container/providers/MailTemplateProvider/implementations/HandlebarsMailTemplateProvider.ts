import handlebars from 'handlebars';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import fs from 'fs';

export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });
        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}
