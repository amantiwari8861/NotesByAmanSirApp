import { ASSETS } from './Assets';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  code?: string;
  images?: string[];
  image?: any;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
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
        content:
          'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together so that each element can be accessed directly by its index in O(1) time. Because the memory is contiguous, arrays have excellent cache locality, but inserting or deleting elements in the middle requires shifting neighbouring elements.',
        code: `// C++ snippet
int arr[5] = {1, 2, 3, 4, 5};
cout << arr[2]; // 3 (O(1) random access)`,
        quiz: [
          {
            question: 'What is the time complexity of accessing an array element by index?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answerIndex: 0,
            explanation:
              'Elements are stored at contiguous memory locations, so the address of any element can be computed directly from its index in constant time.',
          },
          {
            question: 'What is the worst-case time to insert an element in the middle of an array?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answerIndex: 2,
            explanation:
              'All elements after the insertion point must be shifted right by one position, which costs O(n) in the worst case.',
          },
          {
            question: 'Which statement is NOT true about arrays?',
            options: [
              'All elements are stored contiguously in memory',
              'Elements are typically of the same type',
              'Indexing starts at 0 in most languages',
              'An array can grow without ever being recreated',
            ],
            answerIndex: 3,
            explanation:
              'Fixed-size arrays cannot grow; a "dynamic array" (ArrayList, std::vector) recreates itself with a larger buffer when it runs out of space.',
          },
          {
            question: 'A linear search on an unsorted array of n elements runs in:',
            options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'],
            answerIndex: 1,
            explanation:
              'In the worst case the element is not present, so every one of the n elements must be checked.',
          },
        ],
        flashcards: [
          { front: 'Array', back: 'A collection of elements stored at contiguous memory locations.' },
          { front: 'Index', back: 'The position of an element; indexing starts at 0 in most languages.' },
          { front: 'Static array', back: 'Fixed size, allocated once, cannot grow.' },
          { front: 'Dynamic array', back: 'A resizable array that grows by allocating a larger buffer (e.g. ArrayList, std::vector).' },
          { front: 'Random access cost', back: 'O(1) — computing an address from an index is constant time.' },
        ],
      },
      {
        id: 'linked-list',
        title: 'Linked Lists',
        content:
          'A linked list is a linear data structure in which elements are stored in nodes, and each node points to the next one. Unlike arrays, elements are not stored at contiguous memory locations. Linked lists grow and shrink dynamically, and insertion/deletion at the head costs O(1), but accessing the k-th element requires traversing from the head (O(n)).',
        code: `class Node {
    int data;
    Node next;
}`,
        quiz: [
          {
            question: 'What is the main advantage of a linked list over an array?',
            options: [
              'Dynamic size with easy insertion/deletion',
              'Constant-time random access',
              'Better cache locality',
              'Lower memory usage always',
            ],
            answerIndex: 0,
            explanation:
              'Nodes can be allocated and deallocated individually, so the list grows and shrinks freely and insertion requires only pointer updates.',
          },
          {
            question: 'What is the time to insert a node at the head of a singly linked list?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answerIndex: 0,
            explanation:
              'You only create a new node and update the head pointer, so it is constant time.',
          },
          {
            question: 'In a circular linked list, the last node points to:',
            options: ['null', 'the head', 'itself twice', 'the second last node'],
            answerIndex: 1,
            explanation:
              'In a circular linked list the last node points back to the head, forming a loop.',
          },
          {
            question: 'Finding a node in a singly linked list by value requires:',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answerIndex: 2,
            explanation:
              'Unlike arrays there is no index-based access; you must traverse from the head until the value is found.',
          },
        ],
        flashcards: [
          { front: 'Linked list', back: 'A linear structure of nodes where each node references the next node.' },
          { front: 'Node', back: 'A container holding data and a reference/pointer to the next node.' },
          { front: 'Head', back: 'The reference to the first node of the list (null for an empty list).' },
          { front: 'Singly vs doubly', back: 'Singly lists store a next pointer only; doubly lists also store a previous pointer.' },
          { front: 'Insert at head', back: 'O(1) — update head pointer to the new node.' },
        ],
      },
      {
        id: 'stacks-queues',
        title: 'Stacks & Queues',
        content:
          'Stacks and queues are linear data structures that restrict how elements are added and removed. A stack follows LIFO (Last In, First Out) — push adds to the top and pop removes from the top. A queue follows FIFO (First In, First Out) — enqueue adds to the rear and dequeue removes from the front. Applications include the call stack and undo history (stack) and scheduling, buffers and BFS (queue).',
        code: `// Stack operations (all O(1))
push(x);   // add to top
pop();     // remove from top
top();     // peek at top

// Queue operations (all O(1))
enqueue(x); // add to rear
dequeue();  // remove from front
front();    // peek at front`,
        quiz: [
          {
            question: 'A stack is based on which principle?',
            options: ['FIFO', 'LIFO', 'Random access', 'Priority order'],
            answerIndex: 1,
            explanation: 'Last In, First Out — the most recently added element is removed first.',
          },
          {
            question: 'Which data structure is best suited for a browser "back" button?',
            options: ['Queue', 'Stack', 'Heap', 'Linked list queue'],
            answerIndex: 1,
            explanation:
              'The history is a stack: the most recently visited page is popped first when you press Back.',
          },
          {
            question: 'Which operations add/remove an element in a queue?',
            options: ['push/pop', 'insert/delete', 'enqueue/dequeue', 'push/dequeue'],
            answerIndex: 2,
            explanation: 'enqueue appends to the rear and dequeue removes from the front.',
          },
          {
            question: 'Breadth-first search (BFS) on a graph typically uses a:',
            options: ['Stack', 'Queue', 'Min-heap', 'Linked list only'],
            answerIndex: 1,
            explanation: 'BFS explores nodes level by level, requiring FIFO ordering — exactly what a queue provides.',
          },
        ],
        flashcards: [
          { front: 'Stack', back: 'LIFO structure. push adds to the top, pop removes from the top.' },
          { front: 'Queue', back: 'FIFO structure. enqueue adds to the rear, dequeue removes from the front.' },
          { front: 'Call stack', back: 'Runtime stack holding active function calls; returns pop frames off.' },
          { front: 'Undo history', back: 'Implemented with a stack of performed actions.' },
          { front: 'BFS queue', back: 'Breadth-first search uses a queue to visit nodes level by level.' },
        ],
      },
    ],
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
        content:
          'Object-oriented programming (OOP) organizes software design around data (objects) rather than functions. The four pillars are Encapsulation (hiding data behind methods), Inheritance (child classes reuse parent behavior), Polymorphism (the same method name behaving differently per object) and Abstraction (showing only essential details). Java implements these with classes, interfaces, access modifiers, method overloading and overriding.',
        code: `public class Animal {
    private String name;      // encapsulation

    public Animal(String name) {
        this.name = name;
    }

    void speak() {            // polymorphism (overridden)
        System.out.println("Bark");
    }
}`,
        quiz: [
          {
            question: 'Which OOP pillar hides internal data behind methods?',
            options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
            answerIndex: 2,
            explanation: 'Encapsulation bundles data and methods together and restricts direct access via access modifiers (private/protected).',
          },
          {
            question: 'The ability of a method to behave differently for different object types is:',
            options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Serialization'],
            answerIndex: 1,
            explanation: 'Polymorphism lets the same interface/hierarchy produce different behaviour, e.g. via overriding or overloading.',
          },
          {
            question: 'Which Java keyword is used for inheritance?',
            options: ['implements', 'extends', 'import', 'superclass'],
            answerIndex: 1,
            explanation: 'A class inherits from another class using extends; implements is used with interfaces.',
          },
          {
            question: 'What is the main job of a constructor?',
            options: [
              'To destroy an object',
              'To initialize the new object state',
              'To copy a method',
              'To overload the class',
            ],
            answerIndex: 1,
            explanation: 'A constructor runs when an object is created and initializes its fields/state.',
          },
        ],
        flashcards: [
          { front: 'Class vs Object', back: 'A class is a blueprint; an object is a runtime instance of that class.' },
          { front: 'Encapsulation', back: 'Bundling data + methods and controlling access with modifiers.' },
          { front: 'Inheritance', back: 'A child class reuses parent code using extends.' },
          { front: 'Polymorphism', back: 'Same method name, different behaviour — via overloading and overriding.' },
          { front: 'Abstraction', back: 'Showing only essential details; implemented with abstract classes and interfaces.' },
        ],
      },
      {
        id: 'collections',
        title: 'Collections Framework',
        content:
          'The Java Collections Framework (JCF) is a set of interfaces and classes for storing and manipulating groups of objects. Core interfaces are List (ordered, allows duplicates), Set (no duplicates) and Map (key-value pairs). Common implementations are ArrayList, LinkedList, HashSet, LinkedHashSet, TreeSet, HashMap and TreeMap. Each has different performance trade-offs for insertion, lookup and ordering.',
        code: 'List<String> list = new ArrayList<>();\nSet<Integer> set = new HashSet<>();\nMap<String, Integer> map = new HashMap<>();',
        quiz: [
          {
            question: 'Which is NOT a List implementation?',
            options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'],
            answerIndex: 2,
            explanation: 'HashSet is a Set implementation — it stores unique elements with no guaranteed order.',
          },
          {
            question: 'Which collection does NOT allow duplicate elements?',
            options: ['ArrayList', 'LinkedList', 'Set', 'CopyOnWriteArrayList'],
            answerIndex: 2,
            explanation: 'By definition a Set permits at most one instance of each distinct value.',
          },
          {
            question: 'A HashMap offers average-case lookup time of:',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            answerIndex: 0,
            explanation: 'Hash-based buckets give constant-time average insert/lookup (O(log n) for TreeMap).',
          },
          {
            question: 'Which type stores key-value pairs?',
            options: ['List', 'Set', 'Map', 'Queue'],
            answerIndex: 2,
            explanation: 'A Map associates each key with a value, e.g. HashMap or TreeMap.',
          },
        ],
        flashcards: [
          { front: 'List', back: 'Ordered collection that allows duplicates (ArrayList, LinkedList).' },
          { front: 'Set', back: 'Unordered collection that forbids duplicates (HashSet, TreeSet).' },
          { front: 'Map', back: 'Key-value pairs, keys are unique (HashMap, TreeMap).' },
          { front: 'HashMap', back: 'Hash-based Map with average O(1) lookup, no order guarantees.' },
          { front: 'ArrayList vs LinkedList', back: 'ArrayList: contiguous, fast indexing. LinkedList: linked nodes, fast insert/delete at ends.' },
        ],
      },
      {
        id: 'exception-handling',
        title: 'Exception Handling',
        content:
          'Exception handling manages runtime errors so a program can fail gracefully. Java uses try, catch and finally blocks, and the throws clause on methods. Checked exceptions must be declared or caught at compile time; unchecked exceptions (RuntimeException) are not forced by the compiler. The finally block runs regardless of whether an exception was thrown, and is ideal for cleanup like closing files.',
        code: `try {
    int result = 10 / denominator;  // may throw
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Cleanup always runs");
}`,
        quiz: [
          {
            question: 'By default, exceptions caused by division by zero in Java belong to:',
            options: ['IOException', 'ArithmeticException', 'ArrayIndexOutOfBounds', 'NumberFormat'],
            answerIndex: 1,
            explanation: 'Integer division by zero throws ArithmeticException, a runtime (unchecked) exception.',
          },
          {
            question: 'Which block always executes even when an exception occurs?',
            options: ['catch', 'try', 'finally', 'throws'],
            answerIndex: 2,
            explanation: 'The finally block runs no matter what, which makes it perfect for releasing resources.',
          },
          {
            question: 'Checked exceptions must be:',
            options: [
              'Ignored by the compiler',
              'Declared (throws) or caught at compile time',
              'Rethrown automatically',
              'Extended at runtime',
            ],
            answerIndex: 1,
            explanation: 'The compiler forces checked exceptions (like IOException) to be declared or handled.',
          },
          {
            question: 'Which is an unchecked exception type?',
            options: ['IOException', 'SQLException', 'NullPointerException', 'FileNotFoundException'],
            answerIndex: 2,
            explanation: 'NullPointerException is a RuntimeException — it is not checked at compile time.',
          },
        ],
        flashcards: [
          { front: 'try/catch', back: 'try guards risky code; catch handles a specific exception type.' },
          { front: 'finally', back: 'Always runs after try/catch, used for cleanup (closing files/connections).' },
          { front: 'Checked exceptions', back: 'Must be caught or declared; e.g. IOException.' },
          { front: 'Unchecked exceptions', back: 'Extend RuntimeException; e.g. NullPointerException.' },
          { front: 'throws', back: 'Declares that a method may throw a checked exception to its caller.' },
        ],
      },
    ],
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
        content:
          'SQL (Structured Query Language) is the standard language used to define and manipulate relational databases. DDL statements (CREATE, ALTER, DROP) define the schema, while DML statements (SELECT, INSERT, UPDATE, DELETE) manipulate the data. The SELECT statement combined with WHERE, GROUP BY and ORDER BY is the most commonly used tool for querying tables.',
        code: `SELECT name, marks FROM students
WHERE marks >= 40
ORDER BY marks DESC;`,
        quiz: [
          {
            question: 'Which clause filters ROWS based on a condition?',
            options: ['ORDER BY', 'WHERE', 'HAVING', 'SELECT'],
            answerIndex: 1,
            explanation: 'WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY.',
          },
          {
            question: 'Which of these is a DDL command?',
            options: ['SELECT', 'INSERT', 'CREATE', 'UPDATE'],
            answerIndex: 2,
            explanation: 'CREATE, ALTER and DROP define the database structure (Data Definition Language).',
          },
          {
            question: 'The PRIMARY KEY constraint guarantees:',
            options: [
              'Values are unique and not null',
              'Values are automatically indexed only',
              'Duplicate rows are allowed',
              'The column is always a number',
            ],
            answerIndex: 0,
            explanation: 'A primary key uniquely identifies each row: values must be unique and cannot be NULL.',
          },
          {
            question: 'Which statement retrieves data from a table?',
            options: ['SELECT', 'DELETE', 'GRANT', 'COMMIT'],
            answerIndex: 0,
            explanation: 'SELECT reads rows and returns columns from one or more tables.',
          },
        ],
        flashcards: [
          { front: 'DDL vs DML', back: 'DDL defines structure (CREATE/ALTER/DROP); DML manipulates data (SELECT/INSERT/UPDATE/DELETE).' },
          { front: 'PRIMARY KEY', back: 'Column (or set) that uniquely identifies each row; unique and NOT NULL.' },
          { front: 'WHERE vs HAVING', back: 'WHERE filters rows; HAVING filters grouped results.' },
          { front: 'JOIN', back: 'Combines rows from two or more tables using a related column.' },
          { front: 'ORDER BY', back: 'Sorts the result set ascending (ASC) or descending (DESC).' },
        ],
      },
      {
        id: 'normalization',
        title: 'Normalization',
        content:
          'Normalization organizes a database to reduce redundancy and avoid anomalies by decomposing tables into normal forms (NF). 1NF requires atomic (single-valued) columns. 2NF removes partial dependencies — non-key attributes must depend on the whole primary key. 3NF removes transitive dependencies, where a non-key attribute depends on another non-key attribute rather than directly on the key.',
        code: `-- Unnormalized: redudant course names stored per student
students(id, name, course1_name, course1_marks, course2_name, course2_marks)

-- Normalized (3NF): split into students & enrollments tables
students(id, name)
enrollments(student_id, course, marks)`,
        quiz: [
          {
            question: 'Why is normalization performed on a database?',
            options: [
              'To increase redundancy',
              'To reduce redundancy and avoid update anomalies',
              'To slow down queries',
              'To merge all tables into one',
            ],
            answerIndex: 1,
            explanation: 'Normalization removes duplicate data so updates do not leave the database inconsistent.',
          },
          {
            question: 'Which normal form requires atomic (indivisible) column values?',
            options: ['1NF', '2NF', '3NF', 'BCNF'],
            answerIndex: 0,
            explanation: 'First Normal Form requires every column hold a single atomic value, not a list.',
          },
          {
            question: '3NF removes which kind of dependency?',
            options: ['Functional', 'Transitive', 'Partial', 'Circular'],
            answerIndex: 1,
            explanation: '3NF removes transitive dependencies — a non-key attribute depending on another non-key attribute.',
          },
          {
            question: 'A table is in 1NF but has a partial dependency. To reach 2NF you must:',
            options: [
              'Add more columns',
              'Remove atomic columns',
              'Remove partial dependencies of non-key attributes on part of a composite key',
              'Drop the primary key',
            ],
            answerIndex: 2,
            explanation: '2NF eliminates partial dependencies so every non-key attribute depends on the whole primary key.',
          },
        ],
        flashcards: [
          { front: '1NF', back: 'Every column stores a single, atomic value (no lists or repeating groups).' },
          { front: '2NF', back: '1NF + no partial dependency on part of a composite key.' },
          { front: '3NF', back: '2NF + no transitive dependency between non-key attributes.' },
          { front: 'Anomaly', back: 'Insertion/update/deletion inconsistency caused by redundancy.' },
          { front: 'Transitive dependency', back: 'A -> B and B -> C, so C depends on non-key B instead of key A.' },
        ],
      },
    ],
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
        content:
          'A process is an instance of a computer program being executed. Each process has its own address space and is represented by a Process Control Block (PCB) holding its state, program counter, registers and memory info. Processes move between states: new, ready, running, waiting and terminated. Switching the CPU between processes is called a context switch and carries a cost.',
        code: `// Typical process states
new -> ready -> running -> waiting -> ready
            |          |
            +<-terminated<-+`,
        quiz: [
          {
            question: 'A process is best described as:',
            options: [
              'A program in execution',
              'A hard disk file',
              'A CPU instruction',
              'A network packet',
            ],
            answerIndex: 0,
            explanation: 'The classic definition: a process is an instance of a program that is being executed.',
          },
          {
            question: 'Which is NOT a valid process state?',
            options: ['Running', 'Ready', 'Waiting', 'Compiled'],
            answerIndex: 3,
            explanation: 'Process states are new, ready, running, waiting/blocked and terminated; "compiled" is not one of them.',
          },
          {
            question: 'What does the Process Control Block (PCB) store?',
            options: [
              'Only the process name',
              'State, program counter, registers and memory info',
              'Only the exit code',
              'Nothing at all',
            ],
            answerIndex: 1,
            explanation: 'The PCB is the kernel data structure that describes a process completely.',
          },
          {
            question: 'Switching the CPU between processes by saving/restoring state is called:',
            options: ['Deadlock', 'Context switch', 'Paging', 'Scheduling algorithm'],
            answerIndex: 1,
            explanation: 'A context switch saves the in-coming process and restores the next one, with an associated overhead.',
          },
        ],
        flashcards: [
          { front: 'Process', back: 'An instance of a program in execution, with its own address space.' },
          { front: 'PCB', back: 'Process Control Block — kernel structure with process metadata.' },
          { front: 'Process states', back: 'new, ready, running, waiting, terminated.' },
          { front: 'Context switch', back: 'Saving and restoring CPU state when switching between processes.' },
          { front: 'Multiprogramming', back: 'Keeping multiple processes ready in memory to maximize CPU utilization.' },
        ],
      },
      {
        id: 'scheduling',
        title: 'CPU Scheduling',
        content:
          'Scheduling decides which ready process gets the CPU. FCFS (First Come First Served) is simple but suffers from convoy effects. SJF (Shortest Job First) minimizes average waiting time but needs future knowledge. Round Robin gives each process a fixed time slice in a circular order and is ideal for interactive systems, while Priority scheduling runs the highest-priority process first and can starve low-priority ones.',
        code: `// Round Robin with quantum q = 2
readyQueue = [P1, P2, P3]
// runs P1 for 2ms, then P2 for 2ms, then P3 2ms, cycles...`,
        quiz: [
          {
            question: 'Which algorithm is best suited for interactive (time-sharing) systems?',
            options: ['FCFS', 'Round Robin', 'SJF', 'LIFO'],
            answerIndex: 1,
            explanation: 'Round Robin gives every process a time slice, giving fast response to interactive users.',
          },
          {
            question: 'The main disadvantage of SJF is:',
            options: [
              'High context-switch overhead always',
              'It needs the future CPU-burst length',
              'No starvation',
              'It ignores CPU utilization',
            ],
            answerIndex: 1,
            explanation: 'SJF requires knowing the next CPU burst to pick the shortest job — usually unknown in advance.',
          },
          {
            question: 'Priority scheduling can lead to:',
            options: ['Starvation of low-priority processes', 'No responses', 'Deadlock by design', 'Cache misses'],
            answerIndex: 0,
            explanation: 'Low-priority processes may never run if higher-priority ones keep arriving; aging fixes this.',
          },
          {
            question: 'FCFS is criticized for:',
            options: [
              'Preempting processes randomly',
              'The convoy effect (short jobs wait behind a long one)',
              'Ignoring first-come ordering',
              'Being too complex',
            ],
            answerIndex: 1,
            explanation: 'In FCFS a single long job can make many short jobs wait, wasting average waiting time.',
          },
        ],
        flashcards: [
          { front: 'FCFS', back: 'First Come First Served; simple, non-preemptive, suffers from convoy effect.' },
          { front: 'SJF', back: 'Runs the shortest job next; minimizes average wait but needs burst knowledge.' },
          { front: 'Round Robin', back: 'Each process gets a fixed quantum in circular order; great for interactivity.' },
          { front: 'Priority scheduling', back: 'CPU goes to highest-priority ready process; risk of starvation.' },
          { front: 'Waiting time', back: 'Total time a process spends waiting in the ready queue before finishing.' },
        ],
      },
    ],
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
        content:
          'The Open Systems Interconnection (OSI) model describes seven layers that computer systems use to communicate over a network: Physical, Data Link, Network, Transport, Session, Presentation and Application. Each layer serves the layer above it and uses the layer below it. The Network layer handles addressing and routing, the Transport layer provides end-to-end delivery (TCP/UDP), and the Application layer is where protocols like HTTP, DNS and SMTP live.',
        code: `7 Application  (HTTP, DNS, SMTP)
6 Presentation (encryption, encoding)
5 Session      (dialog control)
4 Transport    (TCP/UDP, reliability)
3 Network      (IP addressing, routing)
2 Data Link    (MAC, frames)
1 Physical     (bits, cables)`,
        quiz: [
          {
            question: 'How many layers are in the OSI reference model?',
            options: ['4', '5', '6', '7'],
            answerIndex: 3,
            explanation: 'The OSI model has seven layers, from Physical up to Application.',
          },
          {
            question: 'Routing of packets happens at which layer?',
            options: ['Transport', 'Network', 'Data Link', 'Session'],
            answerIndex: 1,
            explanation: 'The Network layer (layer 3) is responsible for logical addressing and routing between networks.',
          },
          {
            question: 'HTTP is a protocol of which layer?',
            options: ['Physical', 'Transport', 'Application', 'Presentation'],
            answerIndex: 2,
            explanation: 'Web protocols like HTTP, DNS and SMTP operate at the Application layer.',
          },
          {
            question: 'MAC addresses are handled at which layer?',
            options: ['Network', 'Data Link', 'Transport', 'Session'],
            answerIndex: 1,
            explanation: 'The Data Link layer works with frames and hardware (MAC) addresses within a single network.',
          },
        ],
        flashcards: [
          { front: 'OSI model', back: '7-layer reference model: Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
          { front: 'Application layer', back: 'End-user protocols: HTTP, DNS, SMTP, FTP.' },
          { front: 'Transport layer', back: 'End-to-end delivery and reliability via TCP and UDP.' },
          { front: 'Network layer', back: 'Logical IP addressing and routing between networks.' },
          { front: 'Data Link layer', back: 'Frames and MAC addresses for direct links between nodes.' },
        ],
      },
      {
        id: 'tcp-ip-model',
        title: 'TCP/IP Model',
        content:
          'The TCP/IP model is the practical model used by the internet, with four layers: Network Interface, Internet, Transport and Application. The Internet layer corresponds roughly to the OSI Network layer (IP addressing), and the Transport layer hosts TCP (reliable, connection-oriented) and UDP (fast, connectionless). TCP guarantees ordered, error-checked delivery; UDP trades that reliability for lower latency.',
        code: `Application (HTTP, SMTP, DNS)
Transport   (TCP — reliable, UDP — fast)
Internet    (IP, ICMP)
Network Interface (Ethernet, Wi-Fi)`,
        quiz: [
          {
            question: 'How many layers does the TCP/IP model have?',
            options: ['2', '3', '4', '7'],
            answerIndex: 2,
            explanation: 'TCP/IP is commonly described with four layers: Network Interface, Internet, Transport, Application.',
          },
          {
            question: 'Which protocol is connection-oriented and reliable?',
            options: ['UDP', 'TCP', 'ICMP', 'ARP'],
            answerIndex: 1,
            explanation: 'TCP establishes a connection and guarantees ordered, error-checked delivery.',
          },
          {
            question: 'UDP is preferred over TCP for:',
            options: [
              'File downloads',
              'Live video streaming',
              'Email transfer',
              'Web pages',
            ],
            answerIndex: 1,
            explanation: 'UDP prioritizes speed and low latency, making it suitable for live streaming and VoIP.',
          },
          {
            question: 'IP addressing is performed in which layer of TCP/IP?',
            options: ['Application', 'Transport', 'Internet', 'Network Interface'],
            answerIndex: 2,
            explanation: 'The Internet layer handles IP addressing and routing, analogous to the OSI Network layer.',
          },
        ],
        flashcards: [
          { front: 'TCP/IP model', back: 'Four practical layers: Network Interface, Internet, Transport, Application.' },
          { front: 'TCP', back: 'Transmission Control Protocol: reliable, ordered, connection-oriented.' },
          { front: 'UDP', back: 'User Datagram Protocol: fast, connectionless, no guarantee of delivery.' },
          { front: 'IP address', back: 'Logical address used by the Internet layer to route packets.' },
          { front: 'Port number', back: 'Identifies a specific application/service at a host (e.g. 80 for HTTP, 443 for HTTPS).' },
        ],
      },
    ],
  },
];