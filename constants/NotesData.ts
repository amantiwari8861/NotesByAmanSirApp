import { ASSETS } from './Assets';

export interface Topic {
  id: string;
  title: string;
  content: string;
  code?: string;
  images?: string[];
  image?: any;
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  topics: Topic[];
  image?: any;
}

export const NOTES_DATA: Subject[] = [
  {
    id: 'dsa',
    title: 'DSA',
    icon: 'code-slash',
    color: '#3b82f6', // blue
    description: 'Data Structures and Algorithms for coding interviews.',
    image: ASSETS.dsa,
    topics: [
      {
        id: 'arrays',
        title: 'Arrays',
        content: 'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.',
        code: `// C++ snippet
int arr[5] = {1, 2, 3, 4, 5};`,
      },
      {
        id: 'linked-list',
        title: 'Linked Lists',
        content: 'A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations.',
        code: `class Node {
    int data;
    Node next;
}`,
      }
    ]
  },
  {
    id: 'java',
    title: 'Java',
    icon: 'cafe',
    color: '#f59e0b', // amber
    description: 'Object Oriented Programming with Java.',
    image: ASSETS.java,
    topics: [
      {
        id: 'oop-concepts',
        title: 'OOP Concepts',
        content: 'Object-oriented programming (OOP) is a computer programming model that organizes software design around data, or objects, rather than functions and logic.',
        code: `public class Animal {
    void speak() {
        System.out.println("Bark");
    }
}`,
      },
      {
        id: 'collections',
        title: 'Collections Framework',
        content: 'The Java Collections Framework (JCF) is a set of classes and interfaces that implement commonly reusable collection data structures.',
        code: 'List<String> list = new ArrayList<>();',
      }
    ]
  },
  {
    id: 'dbms',
    title: 'DBMS',
    icon: 'server',
    color: '#ef4444', // red
    description: 'Database Management Systems and SQL.',
    topics: [
      {
        id: 'sql-basics',
        title: 'SQL Basics',
        content: 'SQL (Structured Query Language) is a standard language for database creation and manipulation.',
      }
    ]
  },
  {
    id: 'os',
    title: 'Operating Systems',
    icon: 'desktop',
    color: '#10b981', // emerald
    description: 'Process management, memory management, and more.',
    topics: [
      {
        id: 'processes',
        title: 'Processes',
        content: 'A process is an instance of a computer program that is being executed by one or many threads.',
      }
    ]
  },
  {
    id: 'cn',
    title: 'Networks',
    icon: 'globe',
    color: '#8b5cf6', // violet
    description: 'Fundamental concepts of Computer Networks.',
    topics: [
      {
        id: 'osi-model',
        title: 'OSI Model',
        content: 'The Open Systems Interconnection (OSI) model describes seven layers that computer systems use to communicate over a network.',
      }
    ]
  }
];
