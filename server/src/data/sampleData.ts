import { Tournament, KnockoutMatch } from '../types';

// Sample tournament data for Sahara Cup
export const tournament: Tournament = {
  id: 'sahara-cup-2025',
  name: 'Sahara Cup 2025',
  description: 'Annual Table Tennis Tournament',
  startDate: '2025-07-22T09:00:00Z',
  endDate: '2025-07-23T18:00:00Z',
  status: 'active',
  players: [
    { id: 'p1', name: 'Anjuman Hasan', email: 'anjuman@company.com' },
    { id: 'p2', name: 'Anusha Reddy Bakaram', email: 'anusha@company.com' },
    { id: 'p3', name: 'Arishti Salaria', email: 'arishti@company.com' },
    { id: 'p4', name: 'Bhavani Parupureddy', email: 'bhavani@company.com' },
    { id: 'p5', name: 'Durga Tammireddy', email: 'durga@company.com' },
    { id: 'p6', name: 'Induja Kala', email: 'induja@company.com' },
    { id: 'p7', name: 'Jyothi M', email: 'jyothi@company.com' },
    { id: 'p8', name: 'Krishna Ramya', email: 'krishna@company.com' },
    { id: 'p9', name: 'Manaswini Pidugu', email: 'manaswini@company.com' },
    { id: 'p10', name: 'Prathyusha Dodda', email: 'prathyusha@company.com' },
    { id: 'p11', name: 'Rubeena Khatun', email: 'rubeena@company.com' },
    { id: 'p12', name: 'Sai Keerthi Tulluru', email: 'saikeerthi@company.com' },
    { id: 'p13', name: 'Sanchita Chakrabarty', email: 'sanchita@company.com' },
    { id: 'p14', name: 'Sanu Gupta', email: 'sanu@company.com' },
    { id: 'p15', name: 'Shreeya Dheera Parvatham', email: 'shreeya@company.com' },
    { id: 'p16', name: 'Siddhi Goyal', email: 'siddhi@company.com' },
    { id: 'p17', name: 'Sneha Sai Pola', email: 'sneha@company.com' },
    { id: 'p18', name: 'Sri Indu Dekkapati', email: 'sriindu@company.com' },
    { id: 'p19', name: 'Srija Panyala', email: 'srija@company.com' },
    { id: 'p20', name: 'Tamanna Koundal', email: 'tamanna@company.com' },
    { id: 'p21', name: 'Treesa James', email: 'treesa@company.com' },
    { id: 'p22', name: 'Tulsi Pratyusha Dintyala', email: 'tulsi@company.com' },
    { id: 'p23', name: 'Vaishnavi Sindham', email: 'vaishnavi@company.com' },
    { id: 'p24', name: 'Yadavalli Dedeepya Sneha', email: 'yadavalli@company.com' },
  ],
  groups: [
    { id: 'g1', name: 'Group A', playerIds: ['p21', 'p5', 'p8'] }, // Treesa James (1st), Durga Tammireddy (2nd), Krishna Ramya (3rd)
    { id: 'g2', name: 'Group B', playerIds: ['p13', 'p1', 'p15'] }, // Sanchita Chakrabarty (1st), Anjuman Hasan (2nd), Shreeya Dheera Parvatham (3rd)
    { id: 'g3', name: 'Group C', playerIds: ['p19', 'p3', 'p4'] }, // Srija Panyala (1st), Arishti Salaria (2nd), Bhavani Parupureddy (3rd)
    { id: 'g4', name: 'Group D', playerIds: ['p6', 'p12', 'p10'] }, // Induja Kala (1st), Sai Keerthi Tulluru (2nd), Prathyusha Dodda (3rd)
    { id: 'g5', name: 'Group E', playerIds: ['p20', 'p22', 'p24'] }, // Tulsi Pratyusha Dintyala (1st), Tamanna Koundal (2nd), Yadavalli Dedeepya Sneha (3rd)
    { id: 'g6', name: 'Group F', playerIds: ['p2', 'p9', 'p17'] }, // Anusha Reddy Bakaram, Manaswini Pidugu, Sneha Sai Pola
    { id: 'g7', name: 'Group G', playerIds: ['p11', 'p18', 'p23'] }, // Rubeena Khatun, Sri Indu Dekkapati, Vaishnavi Sindham
    { id: 'g8', name: 'Group H', playerIds: ['p7', 'p14', 'p16'] }, // Jyothi M, Sanu Gupta, Siddhi Goyal
  ],
  matches: [
    // Group A matches (Treesa James, Krishna Ramya, Durga Tammireddy) - 4-5 PM July 22
    {
      id: 'm1',
      player1Id: 'p21', // Treesa James
      player2Id: 'p8',  // Krishna Ramya
      player1Score: 2,  // Won 2 sets (11-5, 11-1)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T16:00:00Z',
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p21',
      round: 1
    },
    {
      id: 'm2',
      player1Id: 'p5',  // Durga Tammireddy
      player2Id: 'p8',  // Krishna Ramya
      player1Score: 2,  // Won 2 sets (11-8, 11-5)
      player2Score: 1,  // Won 1 set (7-11)
      scheduledTime: '2025-07-22T16:20:00Z',
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p5',
      round: 1
    },
    {
      id: 'm3',
      player1Id: 'p5',  // Durga Tammireddy
      player2Id: 'p21', // Treesa James
      player1Score: 0,  // Won 0 sets (7-11, 8-11)
      player2Score: 2,  // Won 2 sets
      scheduledTime: '2025-07-22T16:40:00Z',
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p21',
      round: 1
    },

    // Group B matches (Sanchita Chakrabarty, Shreeya Dheera Parvatham, Anjuman Hasan) - 2-3 PM July 22
    {
      id: 'm4',
      player1Id: 'p13', // Sanchita Chakrabarty
      player2Id: 'p15', // Shreeya Dheera Parvatham
      player1Score: 2,  // Won 2 sets (15-17, 11-8, 19-17)
      player2Score: 1,  // Won 1 set
      scheduledTime: '2025-07-22T14:00:00Z',
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p13',
      round: 1
    },
    {
      id: 'm5',
      player1Id: 'p13', // Sanchita Chakrabarty
      player2Id: 'p1',  // Anjuman Hasan
      player1Score: 2,  // Won 2 sets (11-3, 11-4)
      player2Score: 1,  // Won 1 set (5-11)
      scheduledTime: '2025-07-22T14:20:00Z',
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p13',
      round: 1
    },
    {
      id: 'm6',
      player1Id: 'p1',  // Anjuman Hasan
      player2Id: 'p15', // Shreeya Dheera Parvatham
      player1Score: 2,  // Won 2 sets (11-7, 11-8)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T14:40:00Z',
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p1',
      round: 1
    },

    // Group C matches (Arishti Salaria, Srija Panyala, Bhavani Parupureddy) - 3-4 PM July 22
    {
      id: 'm7',
      player1Id: 'p3',  // Arishti Salaria
      player2Id: 'p19', // Srija Panyala
      player1Score: 1,  // Won 1 set (13-11)
      player2Score: 2,  // Won 2 sets (11-13, 11-6)
      scheduledTime: '2025-07-22T15:00:00Z',
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p19',
      round: 1
    },
    {
      id: 'm8',
      player1Id: 'p3',  // Arishti Salaria
      player2Id: 'p4',  // Bhavani Parupureddy
      player1Score: 2,  // Won 2 sets (11-4, 14-12)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T15:20:00Z',
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p3',
      round: 1
    },
    {
      id: 'm9',
      player1Id: 'p4',  // Bhavani Parupureddy
      player2Id: 'p19', // Srija Panyala
      player1Score: 0,  // Won 0 sets (4-11, 8-11)
      player2Score: 2,  // Won 2 sets
      scheduledTime: '2025-07-22T15:40:00Z',
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p19',
      round: 1
    },

    // Group D matches (Induja Kala, Sai Keerthi Tulluru, Prathyusha Dodda) - 12-1 PM July 22
    {
      id: 'm10',
      player1Id: 'p6',  // Induja Kala
      player2Id: 'p12', // Sai Keerthi Tulluru
      player1Score: 2,  // Won 2 sets (11-1, 11-6)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T12:00:00Z',
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p6',
      round: 1
    },
    {
      id: 'm11',
      player1Id: 'p12', // Sai Keerthi Tulluru
      player2Id: 'p10', // Prathyusha Dodda
      player1Score: 2,  // Won 2 sets (11-5, 11-7)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T12:20:00Z',
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p12',
      round: 1
    },
    {
      id: 'm12',
      player1Id: 'p6',  // Induja Kala
      player2Id: 'p10', // Prathyusha Dodda
      player1Score: 2,  // Won 2 sets (11-5, 11-4)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-22T12:40:00Z',
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p6',
      round: 1
    },

    // Group E matches (Tamanna Koundal, Tulsi Pratyusha Dintyala, Yadavalli Dedeepya Sneha) - 12:30-1:30 PM July 23
    {
      id: 'm13',
      player1Id: 'p20', // Tamanna Koundal
      player2Id: 'p22', // Tulsi Pratyusha Dintyala
      player1Score: 0,  // Won 0 sets (5-11, 8-11)
      player2Score: 2,  // Won 2 sets
      scheduledTime: '2025-07-23T12:30:00Z',
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p22',
      round: 1
    },
    {
      id: 'm14',
      player1Id: 'p20', // Tamanna Koundal
      player2Id: 'p24', // Yadavalli Dedeepya Sneha
      player1Score: 2,  // Won 2 sets (11-0, 11-9)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-23T12:50:00Z',
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p20',
      round: 1
    },
    {
      id: 'm15',
      player1Id: 'p22', // Tulsi Pratyusha Dintyala
      player2Id: 'p24', // Yadavalli Dedeepya Sneha
      player1Score: 2,  // Won 2 sets (11-6, 11-8)
      player2Score: 0,  // Won 0 sets
      scheduledTime: '2025-07-23T13:10:00Z',
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p22',
      round: 1
    },

    // Group F matches (Anusha Reddy Bakaram, Manaswini Pidugu, Sneha Sai Pola) - 3-4 PM July 23
    {
      id: 'm16',
      player1Id: 'p2',  // Anusha Reddy Bakaram
      player2Id: 'p9',  // Manaswini Pidugu
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T15:00:00Z',
      status: 'upcoming',
      groupId: 'g6',
      round: 1
    },
    {
      id: 'm17',
      player1Id: 'p2',  // Anusha Reddy Bakaram
      player2Id: 'p17', // Sneha Sai Pola
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T15:20:00Z',
      status: 'upcoming',
      groupId: 'g6',
      round: 1
    },
    {
      id: 'm18',
      player1Id: 'p9',  // Manaswini Pidugu
      player2Id: 'p17', // Sneha Sai Pola
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T15:40:00Z',
      status: 'upcoming',
      groupId: 'g6',
      round: 1
    },

    // Group G matches (Rubeena Khatun, Sri Indu Dekkapati, Vaishnavi Sindham) - July 23
    {
      id: 'm19',
      player1Id: 'p11', // Rubeena Khatun
      player2Id: 'p18', // Sri Indu Dekkapati
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T16:00:00Z',
      status: 'live',
      groupId: 'g7',
      round: 1
    },
    {
      id: 'm20',
      player1Id: 'p11', // Rubeena Khatun
      player2Id: 'p23', // Vaishnavi Sindham
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-22T12:00:00Z', // 12:00 PM Tuesday
      status: 'upcoming',
      groupId: 'g7',
      round: 1
    },
    {
      id: 'm21',
      player1Id: 'p11', // Rubeena Khatun
      player2Id: 'p18', // Sri Indu Dekkapati
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-22T14:30:00Z', // 2:30 PM Tuesday
      status: 'upcoming',
      groupId: 'g7',
      round: 1
    },

    // Group H matches (Jyothi M, Sanu Gupta, Siddhi Goyal) - July 23
    {
      id: 'm22',
      player1Id: 'p14', // Sanu Gupta
      player2Id: 'p16', // Siddhi Goyal
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T12:00:00Z', // 12:00 PM Wednesday
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    },
    {
      id: 'm23',
      player1Id: 'p7',  // Jyothi M
      player2Id: 'p14', // Sanu Gupta
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T14:30:00Z', // 2:30 PM Wednesday
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    },
    {
      id: 'm24',
      player1Id: 'p7',  // Jyothi M
      player2Id: 'p16', // Siddhi Goyal
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-23T15:30:00Z', // 3:30 PM Wednesday
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    },
  ],
  // Initialize knockout matches structure
  knockoutMatches: [
    // Round of 16 matches
    {
      id: 'ko1',
      round: 'round16' as const,
      matchNumber: 1,
      player1Id: undefined, // Will be filled from Group A winner
      player2Id: undefined, // Will be filled from Group B runner-up
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'group', value: 'g1' }, // Group A winner
      player2Source: { type: 'group', value: 'g2' }, // Group B runner-up
    },
    {
      id: 'ko2',
      round: 'round16' as const,
      matchNumber: 2,
      player1Id: undefined, // Will be filled from Group C winner
      player2Id: undefined, // Will be filled from Group D runner-up
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'group', value: 'g3' }, // Group C winner
      player2Source: { type: 'group', value: 'g4' }, // Group D runner-up
    },
    {
      id: 'ko3',
      round: 'round16' as const,
      matchNumber: 3,
      player1Id: undefined, // Will be filled from Group E winner
      player2Id: undefined, // Will be filled from Group F runner-up
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'group', value: 'g5' }, // Group E winner
      player2Source: { type: 'group', value: 'g6' }, // Group F runner-up
    },
    {
      id: 'ko4',
      round: 'round16' as const,
      matchNumber: 4,
      player1Id: undefined, // Will be filled from Group G winner
      player2Id: undefined, // Will be filled from Group H runner-up
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'group', value: 'g7' }, // Group G winner
      player2Source: { type: 'group', value: 'g8' }, // Group H runner-up
    },
    // Quarter Finals
    {
      id: 'ko5',
      round: 'quarterfinal' as const,
      matchNumber: 1,
      player1Id: undefined, // Winner of ko1
      player2Id: undefined, // Winner of ko2
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'match', value: 'ko1' },
      player2Source: { type: 'match', value: 'ko2' },
    },
    {
      id: 'ko6',
      round: 'quarterfinal' as const,
      matchNumber: 2,
      player1Id: undefined, // Winner of ko3
      player2Id: undefined, // Winner of ko4
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'match', value: 'ko3' },
      player2Source: { type: 'match', value: 'ko4' },
    },
    // Semi Finals
    {
      id: 'ko7',
      round: 'semifinal' as const,
      matchNumber: 1,
      player1Id: undefined, // Winner of ko5
      player2Id: undefined, // Winner of ko6
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'match', value: 'ko5' },
      player2Source: { type: 'match', value: 'ko6' },
    },
    // Final
    {
      id: 'ko8',
      round: 'final' as const,
      matchNumber: 1,
      player1Id: undefined, // Winner of ko7 
      player2Id: undefined, // There should be another semifinal, but for now we'll handle this in the UI
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming' as const,
      player1Source: { type: 'match', value: 'ko7' },
      player2Source: { type: 'match', value: 'ko7' }, // This represents both semifinal winners
    },
  ],
};

// Default admin user (password: admin123)
export const defaultAdmin = {
  id: 'admin1',
  username: 'admin',
  password: '$2a$10$rQzXZo.gOGNVUYyiVRvPE.eJVx3V/wJWD4y8QR4U4F0.F6qFsGz1K', // bcrypt hash of 'admin123'
  name: 'Tournament Admin'
};
