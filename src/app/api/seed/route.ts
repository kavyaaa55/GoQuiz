
// app/api/seed/route.ts

//import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

//const prisma = new PrismaClient();

export async function GET() {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: 'SQL & NoSQL Databases',
        topic: 'SQL & NoSQL Databases',
        createdAt: new Date(),
      },
    });
    const questions = [
      {
        text: 'Which SQL statement is used to retrieve data from a database?',
        answer: 'SELECT',
        options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'],
        topic: 'SQL Queries',
        difficulty: 1,
      },
      {
        text: 'Which SQL keyword is used to eliminate duplicate records?',
        answer: 'DISTINCT',
        options: ['DISTINCT', 'UNIQUE', 'REMOVE', 'DELETE'],
        topic: 'SQL Queries',
        difficulty: 2,
      },
      {
        text: 'What is the primary key?',
        answer: 'A unique identifier for a record in a table',
        options: [
          'A key that links two tables',
          'A column used for sorting data',
          'A unique identifier for a record in a table',
          'A backup key for data recovery',
        ],
        topic: 'Database Design',
        difficulty: 2,
      },
      {
        text: 'Which JOIN returns all records when there is a match in either left or right table?',
        answer: 'FULL OUTER JOIN',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        topic: 'SQL Joins',
        difficulty: 3,
      },
      {
        text: 'What is normalization in databases?',
        answer: 'Organizing data to reduce redundancy',
        options: [
          'Creating backups of data',
          'Splitting data across servers',
          'Organizing data to reduce redundancy',
          'Encrypting data for security',
        ],
        topic: 'Database Design',
        difficulty: 2,
      },
      {
        text: 'Which command is used to remove a table from a database?',
        answer: 'DROP',
        options: ['REMOVE', 'DELETE', 'DROP', 'CLEAR'],
        topic: 'SQL Commands',
        difficulty: 2,
      },
      {
        text: 'In NoSQL, what is a document?',
        answer: 'A record stored in a document database like MongoDB',
        options: [
          'A SQL table',
          'A file on disk',
          'A record stored in a document database like MongoDB',
          'A schema definition',
        ],
        topic: 'NoSQL',
        difficulty: 1,
      },
      {
        text: 'What is a foreign key?',
        answer: 'A key used to link two tables',
        options: [
          'A unique identifier in the same table',
          'A key used to link two tables',
          'A key for sorting data',
          'A user-defined identifier',
        ],
        topic: 'Database Relationships',
        difficulty: 1,
      },
      {
        text: 'Which NoSQL database is best for storing hierarchical data?',
        answer: 'Document databases',
        options: ['Key-value stores', 'Document databases', 'Graph databases', 'Column stores'],
        topic: 'NoSQL',
        difficulty: 2,
      },
      {
        text: 'Which function returns the number of rows in SQL?',
        answer: 'COUNT()',
        options: ['SUM()', 'TOTAL()', 'COUNT()', 'ROWS()'],
        topic: 'SQL Functions',
        difficulty: 1,
      },
      {
        text: 'What is an index in a database?',
        answer: 'A structure that improves query performance',
        options: [
          'A backup copy of data',
          'A unique key for a record',
          'A structure that improves query performance',
          'A data constraint',
        ],
        topic: 'Database Optimization',
        difficulty: 2,
      },
      {
        text: 'Which of these is a feature of ACID in databases?',
        answer: 'Atomicity',
        options: ['Availability', 'Atomicity', 'Adaptability', 'Accessibility'],
        topic: 'Transactions',
        difficulty: 3,
      },
      {
        text: 'What does SQL stand for?',
        answer: 'Structured Query Language',
        options: [
          'Simple Query Language',
          'Structured Query Language',
          'System Query Logic',
          'Sequential Query Language',
        ],
        topic: 'SQL Basics',
        difficulty: 1,
      },
      {
        text: 'Which NoSQL type is optimized for relationships?',
        answer: 'Graph databases',
        options: ['Document databases', 'Graph databases', 'Key-value stores', 'Relational databases'],
        topic: 'NoSQL',
        difficulty: 2,
      },
      {
        text: 'Which command is used to modify existing data in SQL?',
        answer: 'UPDATE',
        options: ['MODIFY', 'UPDATE', 'CHANGE', 'SET'],
        topic: 'SQL Commands',
        difficulty: 1,
      },
      {
        text: 'Which clause is used to filter grouped rows in SQL?',
        answer: 'HAVING',
        options: ['WHERE', 'HAVING', 'FILTER', 'SELECT'],
        topic: 'SQL Queries',
        difficulty: 3,
      },
      {
        text: 'What is the purpose of the GROUP BY clause?',
        answer: 'To group rows that have the same values',
        options: [
          'To filter rows',
          'To sort rows',
          'To group rows that have the same values',
          'To delete rows',
        ],
        topic: 'SQL Queries',
        difficulty: 2,
      },
      {
        text: 'Which keyword is used to create a new table?',
        answer: 'CREATE TABLE',
        options: ['NEW TABLE', 'MAKE TABLE', 'CREATE TABLE', 'INIT TABLE'],
        topic: 'SQL Commands',
        difficulty: 1,
      },
      {
        text: 'Which NoSQL database uses collections and documents?',
        answer: 'MongoDB',
        options: ['Redis', 'Cassandra', 'Neo4j', 'MongoDB'],
        topic: 'NoSQL',
        difficulty: 2,
      },
      {
        text: 'Which clause is used to sort the result-set in SQL?',
        answer: 'ORDER BY',
        options: ['SORT', 'GROUP BY', 'ORDER BY', 'RANK BY'],
        topic: 'SQL Queries',
        difficulty: 1,
      },
      {
        text: 'Which of these is not a type of NoSQL database?',
        answer: 'Relational',
        options: ['Key-value', 'Document', 'Graph', 'Relational'],
        topic: 'NoSQL',
        difficulty: 2,
      },
      {
        text: 'Which SQL constraint ensures a column cannot have NULL values?',
        answer: 'NOT NULL',
        options: ['UNIQUE', 'DEFAULT', 'NOT NULL', 'PRIMARY KEY'],
        topic: 'Constraints',
        difficulty: 2,
      },
      {
        text: 'Which SQL clause limits the number of returned rows?',
        answer: 'LIMIT',
        options: ['LIMIT', 'TOP', 'ROWCOUNT', 'RESTRICT'],
        topic: 'SQL Queries',
        difficulty: 1,
      },
      {
        text: 'What does the COMMIT statement do in SQL?',
        answer: 'Saves all changes made in the transaction',
        options: [
          'Reverts the changes made',
          'Closes the session',
          'Saves all changes made in the transaction',
          'Validates the schema',
        ],
        topic: 'Transactions',
        difficulty: 2,
      },
      {
        text: 'Which JOIN returns only matching rows from both tables?',
        answer: 'INNER JOIN',
        options: ['LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'INNER JOIN'],
        topic: 'SQL Joins',
        difficulty: 2,
      },
    ];
    for (const q of questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          text: q.text,
          answer: q.answer,
          topic: q.topic,
          difficulty: q.difficulty,
          quizId: quiz.id,
        },
      });

      await prisma.option.createMany({
        data: q.options.map((optionText) => ({
          text: optionText,
          questionId: createdQuestion.id,
        })),
      });
    }

    return NextResponse.json({ message: 'Seeding completed successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
