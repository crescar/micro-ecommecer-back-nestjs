import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export async function hashingPassword(pass: string): Promise<string>{
    return await bcrypt.hash(pass,saltOrRounds);
}

export async function comparePass(pass:string, hash: string) {
    return await bcrypt.compare(pass, hash)
}