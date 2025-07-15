import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Sample Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol Williams',
        email: 'carol.williams@example.com',
      },
    }),
  ]);

  // Create a Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Computer Networks Quiz',
      topic: 'Computer Networks',
      createdAt: new Date(),
    },
  });

  // Questions and Options
  const questions = [
    {
      text: 'What is the primary function of the Data Link Layer in the OSI model?',
      answer: 'Framing and error control',
      options: [
        'Routing packets across networks',
        'Framing and error control',
        'Establishing end-to-end connections',
        'Encrypting data for security',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'Which protocol is used for reliable data transfer in the Transport Layer?',
      answer: 'TCP',
      options: ['UDP', 'TCP', 'IP', 'ICMP'],
      topic: 'Transport Layer',
      difficulty: 1,
    },
    {
      text: 'What is the purpose of the Network Layer in the OSI model?',
      answer: 'Routing packets between networks',
      options: [
        'Error detection and correction',
        'Routing packets between networks',
        'Formatting data for applications',
        'Physical transmission of bits',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'Which device operates primarily at the Data Link Layer?',
      answer: 'Switch',
      options: ['Router', 'Switch', 'Gateway', 'Repeater'],
      topic: 'Networking Devices',
      difficulty: 1,
    },
    {
      text: 'What does CSMA/CD stand for in the context of Ethernet?',
      answer: 'Carrier Sense Multiple Access with Collision Detection',
      options: [
        'Carrier Sense Multiple Access with Collision Detection',
        'Circuit Switching Multiple Access with Collision Detection',
        'Carrier Sense Media Access with Control Detection',
        'Continuous Signal Multiple Access with Collision Detection',
      ],
      topic: 'Ethernet',
      difficulty: 2,
    },
    {
      text: 'Which layer of the OSI model is responsible for end-to-end communication?',
      answer: 'Transport Layer',
      options: [
        'Application Layer',
        'Transport Layer',
        'Network Layer',
        'Data Link Layer',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'What is the maximum size of an Ethernet frame?',
      answer: '1518 bytes',
      options: ['128 bytes', '512 bytes', '1518 bytes', '2048 bytes'],
      topic: 'Ethernet',
      difficulty: 2,
    },
    {
      text: 'Which protocol is used for address resolution in IP networks?',
      answer: 'ARP',
      options: ['DHCP', 'ARP', 'RARP', 'DNS'],
      topic: 'Network Protocols',
      difficulty: 2,
    },
    {
      text: 'What is the purpose of the IP protocol?',
      answer: 'Addressing and routing packets',
      options: [
        'Encrypting data',
        'Addressing and routing packets',
        'Error correction',
        'Session management',
      ],
      topic: 'Network Layer',
      difficulty: 1,
    },
    {
      text: 'Which wireless standard operates in the 5 GHz frequency band?',
      answer: '802.11a',
      options: ['802.11b', '802.11g', '802.11a', '802.11n'],
      topic: 'Wireless Networks',
      difficulty: 2,
    },
    {
      text: 'What is the role of the Application Layer in the OSI model?',
      answer: 'Providing network services to user applications',
      options: [
        'Routing packets',
        'Providing network services to user applications',
        'Framing data',
        'Physical transmission',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'Which protocol is used for dynamic IP address assignment?',
      answer: 'DHCP',
      options: ['DNS', 'DHCP', 'SNMP', 'FTP'],
      topic: 'Network Protocols',
      difficulty: 1,
    },
    {
      text: 'What is the purpose of a subnet mask in IP networking?',
      answer: 'To separate network and host portions of an IP address',
      options: [
        'To encrypt IP packets',
        'To separate network and host portions of an IP address',
        'To prioritize network traffic',
        'To compress IP headers',
      ],
      topic: 'IP Addressing',
      difficulty: 2,
    },
    {
      text: 'Which layer handles physical addressing, such as MAC addresses?',
      answer: 'Data Link Layer',
      options: [
        'Network Layer',
        'Data Link Layer',
        'Transport Layer',
        'Physical Layer',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'What is the primary advantage of packet switching over circuit switching?',
      answer: 'Efficient use of network resources',
      options: [
        'Guaranteed bandwidth',
        'Lower latency',
        'Efficient use of network resources',
        'Simplified routing',
      ],
      topic: 'Switching Techniques',
      difficulty: 2,
    },
    {
      text: 'Which protocol is used for email transmission?',
      answer: 'SMTP',
      options: ['HTTP', 'FTP', 'SMTP', 'SNMP'],
      topic: 'Application Layer',
      //personally think you should just include the code within the artifact tags and leave the explanations to the markdown outside of the artifact tags, since the explanations are not part of the artifact itself.What do you think?difficulty: 1,
    },
    {
      text: 'What is the purpose of the TCP three-way handshake?',
      answer: 'To establish a reliable connection',
      options: [
        'To terminate a connection',
        'To establish a reliable connection',
        'To compress data',
        'To encrypt data',
      ],
      topic: 'Transport Layer',
      difficulty: 2,
    },
    {
      text: 'Which device connects multiple networks using different protocols?',
      answer: 'Gateway',
      options: ['Switch', 'Router', 'Gateway', 'Bridge'],
      topic: 'Networking Devices',
      difficulty: 2,
    },
    {
      text: 'What is the main function of the Physical Layer in the OSI model?',
      answer: 'Transmission of raw bits over a medium',
      options: [
        'Routing packets',
        'Transmission of raw bits over a medium',
        'Error correction',
        'Session management',
      ],
      topic: 'OSI Model',
      difficulty: 1,
    },
    {
      text: 'Which protocol is used for resolving domain names to IP addresses?',
      answer: 'DNS',
      options: ['DHCP', 'DNS', 'ARP', 'ICMP'],
      topic: 'Network Protocols',
      difficulty: 1,
    },
    {
      text: 'What is the purpose of the CRC in data transmission?',
      answer: 'Error detection',
      options: [
        'Error correction',
        'Error detection',
        'Data compression',
        'Data encryption',
      ],
      topic: 'Data Link Layer',
      difficulty: 2,
    },
    {
      text: 'Which layer is responsible for session establishment and termination?',
      answer: 'Session Layer',
      options: [
        'Transport Layer',
        'Session Layer',
        'Presentation Layer',
        'Application Layer',
      ],
      topic: 'OSI Model',
      difficulty: 2,
    },
    {
      text: 'What is the typical speed of a Fast Ethernet connection?',
      answer: '100 Mbps',
      options: ['10 Mbps', '100 Mbps', '1 Gbps', '10 Gbps'],
      topic: 'Ethernet',
      difficulty: 1,
    },
    {
      text: 'Which protocol is used for network management?',
      answer: 'SNMP',
      options: ['SMTP', 'SNMP', 'HTTP', 'FTP'],
      topic: 'Network Protocols',
      difficulty: 2,
    },
    {
      text: 'What is the primary difference between IPv4 and IPv6?',
      answer: 'Address space size',
      options: [
        'Encryption strength',
        'Address space size',
        'Routing efficiency',
        'Packet size',
      ],
      topic: 'IP Addressing',
      difficulty: 2,
    },
  ];

  // Seed Questions and Options
  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        text: q.text,
        answer: q.answer,
        topic: q.topic,
        difficulty: q.difficulty,
        quizId: quiz.id,
      },
    });

    for (const optionText of q.options) {
      await prisma.option.create({
        data: {
          text: optionText,
          questionId: question.id,
        },
      });
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
