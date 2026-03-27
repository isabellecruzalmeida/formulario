import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';


// Adicionando headers de CORS para permitir requisições do arquivo HTML solto
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Tratamento de preflight requisição (OPTIONS) para o CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, formacao, cursoSuperior, tecnico, nomeTecnico, excel, word, powerpoint } = body;

    const candidate = await prisma.candidate.create({
      data: {
        nome,
        formacao,
        cursoSuperior: cursoSuperior || null,
        tecnico,
        nomeTecnico: nomeTecnico || null,
        excel: parseInt(excel, 10),
        word: parseInt(word, 10),
        powerpoint: parseInt(powerpoint, 10),
      },
    });

    return NextResponse.json(
      { success: true, candidate },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Erro ao criar candidato:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao salvar candidato no banco de dados' },
      { status: 500, headers: corsHeaders }
    );
  }
}
