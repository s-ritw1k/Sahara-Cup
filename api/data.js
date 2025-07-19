// Tournament data for API
const tournament = {
  id: 'sahara-cup-2025',
  name: 'Sahara Cup 2025',
  description: 'Annual Table Tennis Tournament',
  startDate: '2025-07-15T09:00:00Z',
  endDate: '2025-07-28T18:00:00Z',
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
    { id: 'g1', name: 'Group A', playerIds: ['p21', 'p5', 'p8'] },
    { id: 'g2', name: 'Group B', playerIds: ['p13', 'p1', 'p15'] },
    { id: 'g3', name: 'Group C', playerIds: ['p19', 'p3', 'p4'] },
    { id: 'g4', name: 'Group D', playerIds: ['p6', 'p12', 'p10'] },
    { id: 'g5', name: 'Group E', playerIds: ['p20', 'p22', 'p24'] },
    { id: 'g6', name: 'Group F', playerIds: ['p2', 'p9', 'p17'] },
    { id: 'g7', name: 'Group G', playerIds: ['p11', 'p18', 'p23'] },
    { id: 'g8', name: 'Group H', playerIds: ['p7', 'p14', 'p16'] },
  ],
  matches: [
    // Group A matches (4-5 PM on 15/07/25)
    {
      id: 'm1',
      player1Id: 'p21', // Treesa James
      player2Id: 'p8',  // Krishna Ramya
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [5, 1],
      scheduledTime: '2025-07-15T16:00:00Z', // 4 PM
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p21',
      round: 1
    },
    {
      id: 'm2',
      player1Id: 'p5',  // Durga Tammireddy
      player2Id: 'p8',  // Krishna Ramya
      player1Score: 2,
      player2Score: 1,
      player1SetScores: [11, 7, 11],
      player2SetScores: [8, 11, 5],
      scheduledTime: '2025-07-15T16:20:00Z', // 4:20 PM
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p5',
      round: 1
    },
    {
      id: 'm3',
      player1Id: 'p5',  // Durga Tammireddy
      player2Id: 'p21', // Treesa James
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [7, 8],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-15T16:40:00Z', // 4:40 PM
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p21',
      round: 1
    },
    // Group B matches (2-3 PM on 15/07/25)
    {
      id: 'm4',
      player1Id: 'p13', // Sanchita Chakrabarty
      player2Id: 'p15', // Shreeya Dheera Parvatham
      player1Score: 2,
      player2Score: 1,
      player1SetScores: [15, 11, 19],
      player2SetScores: [17, 8, 17],
      scheduledTime: '2025-07-15T14:00:00Z', // 2 PM
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p13',
      round: 1
    },
    {
      id: 'm5',
      player1Id: 'p13', // Sanchita Chakrabarty
      player2Id: 'p1',  // Anjuman Hasan
      player1Score: 2,
      player2Score: 1,
      player1SetScores: [3, 11, 11],
      player2SetScores: [11, 5, 4],
      scheduledTime: '2025-07-15T14:20:00Z', // 2:20 PM
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p13',
      round: 1
    },
    {
      id: 'm6',
      player1Id: 'p1',  // Anjuman Hasan
      player2Id: 'p15', // Shreeya Dheera Parvatham
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [7, 8],
      scheduledTime: '2025-07-15T14:40:00Z', // 2:40 PM
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p1',
      round: 1
    },
    // Group C matches (3-4 PM on 15/07/25)
    {
      id: 'm7',
      player1Id: 'p3',  // Arishti Salaria
      player2Id: 'p19', // Srija Panyala
      player1Score: 1,
      player2Score: 2,
      player1SetScores: [13, 11, 6],
      player2SetScores: [11, 13, 11],
      scheduledTime: '2025-07-15T15:00:00Z', // 3 PM
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p19',
      round: 1
    },
    {
      id: 'm8',
      player1Id: 'p3',  // Arishti Salaria
      player2Id: 'p4',  // Bhavani Parupureddy
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 14],
      player2SetScores: [4, 12],
      scheduledTime: '2025-07-15T15:20:00Z', // 3:20 PM
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p3',
      round: 1
    },
    {
      id: 'm9',
      player1Id: 'p4',  // Bhavani Parupureddy
      player2Id: 'p19', // Srija Panyala
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [4, 8],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-15T15:40:00Z', // 3:40 PM
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p19',
      round: 1
    },
    // Group D matches (12-1 PM on 15/07/25)
    {
      id: 'm10',
      player1Id: 'p6',  // Induja Kala
      player2Id: 'p12', // Sai Keerthi Tulluru
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [1, 6],
      scheduledTime: '2025-07-15T12:00:00Z', // 12 PM
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p6',
      round: 1
    },
    {
      id: 'm11',
      player1Id: 'p12', // Sai Keerthi Tulluru
      player2Id: 'p10', // Prathyusha Dodda
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [5, 7],
      scheduledTime: '2025-07-15T12:20:00Z', // 12:20 PM
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p12',
      round: 1
    },
    {
      id: 'm12',
      player1Id: 'p6',  // Induja Kala
      player2Id: 'p10', // Prathyusha Dodda
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [5, 4],
      scheduledTime: '2025-07-15T12:40:00Z', // 12:40 PM
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p6',
      round: 1
    },
    // Group E matches (12:30-1:30 PM on 16/07/25)
    {
      id: 'm13',
      player1Id: 'p22', // Tulsi Pratyusha Dintyala
      player2Id: 'p24', // Yadavalli Dedeepya Sneha
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [6, 8],
      scheduledTime: '2025-07-16T12:30:00Z', // 12:30 PM
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p22',
      round: 1
    },
    {
      id: 'm14',
      player1Id: 'p20', // Tamanna Koundal
      player2Id: 'p22', // Tulsi Pratyusha Dintyala
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [5, 8],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-16T12:50:00Z', // 12:50 PM
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p22',
      round: 1
    },
    {
      id: 'm15',
      player1Id: 'p20', // Tamanna Koundal
      player2Id: 'p24', // Yadavalli Dedeepya Sneha
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [0, 9],
      scheduledTime: '2025-07-16T13:10:00Z', // 1:10 PM
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p20',
      round: 1
    },
    // Group F matches (3-4 PM on 16/07/25)
    {
      id: 'm16',
      player1Id: 'p2',  // Anusha Reddy Bakaram
      player2Id: 'p9',  // Manaswini Pidugu
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [3, 1],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-16T15:00:00Z', // 3 PM
      status: 'completed',
      groupId: 'g6',
      winnerId: 'p9',
      round: 1
    },
    {
      id: 'm17',
      player1Id: 'p2',  // Anusha Reddy Bakaram
      player2Id: 'p17', // Sneha Sai Pola
      player1Score: 2,
      player2Score: 0,
      player1SetScores: [11, 11],
      player2SetScores: [1, 5],
      scheduledTime: '2025-07-16T15:20:00Z', // 3:20 PM
      status: 'completed',
      groupId: 'g6',
      winnerId: 'p2',
      round: 1
    },
    {
      id: 'm18',
      player1Id: 'p17', // Sneha Sai Pola
      player2Id: 'p9',  // Manaswini Pidugu
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [4, 4],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-16T15:40:00Z', // 3:40 PM
      status: 'completed',
      groupId: 'g6',
      winnerId: 'p9',
      round: 1
    },
    // Group G matches
    {
      id: 'm19',
      player1Id: 'p18', // Sri Indu Dekkapati
      player2Id: 'p23', // Vaishnavi Sindham
      player1Score: 0,
      player2Score: 2,
      player1SetScores: [3, 0],
      player2SetScores: [11, 11],
      scheduledTime: '2025-07-22T14:00:00Z',
      status: 'completed',
      groupId: 'g7',
      winnerId: 'p23',
      round: 1
    },
    // Group G - Remaining matches scheduled for July 22 at 2 PM
    {
      id: 'm20',
      player1Id: 'p23', // Vaishnavi Sindham
      player2Id: 'p11', // Rubeena Khatun
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-22T14:00:00Z',
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
      scheduledTime: '2025-07-22T14:30:00Z',
      status: 'upcoming',
      groupId: 'g7',
      round: 1
    },
    // Group H matches (2-3 PM on 28/07/25)
    {
      id: 'm22',
      player1Id: 'p7',  // Jyothi M
      player2Id: 'p14', // Sanu Gupta
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-28T14:00:00Z', // 2 PM
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    },
    {
      id: 'm23',
      player1Id: 'p7',  // Jyothi M
      player2Id: 'p16', // Siddhi Goyal
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-28T14:20:00Z', // 2:20 PM
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    },
    {
      id: 'm24',
      player1Id: 'p14', // Sanu Gupta
      player2Id: 'p16', // Siddhi Goyal
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-28T14:40:00Z', // 2:40 PM
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    }
  ],
  knockoutMatches: [
    // Round of 16 matches - Fixed structure with proper bracket arrangement
    {
      id: 'k1',
      round: 'round16',
      matchNumber: 1,
      player1Id: 'p21', // #1 of Group A (Treesa James)
      player2Id: 'p1',  // #2 of Group B (Anjuman Hasan)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T14:00:00Z',
      player1Source: { type: 'group', value: 'Group A', position: 1 },
      player2Source: { type: 'group', value: 'Group B', position: 2 }
    },
    {
      id: 'k2',
      round: 'round16',
      matchNumber: 2,
      player1Id: 'p19', // #1 of Group C (Srija Panyala)
      player2Id: 'p12', // #2 of Group D (Sai Keerthi Tulluru)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T14:30:00Z',
      player1Source: { type: 'group', value: 'Group C', position: 1 },
      player2Source: { type: 'group', value: 'Group D', position: 2 }
    },
    {
      id: 'k3',
      round: 'round16',
      matchNumber: 3,
      player1Id: 'p22', // #1 of Group E (Tulsi Pratyusha Dintyala)
      player2Id: 'p2',  // #2 of Group F (Anusha Reddy Bakaram)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T15:00:00Z',
      player1Source: { type: 'group', value: 'Group E', position: 1 },
      player2Source: { type: 'group', value: 'Group F', position: 2 }
    },
    {
      id: 'k4',
      round: 'round16',
      matchNumber: 4,
      player1Id: 'p23', // #1 of Group G (Vaishnavi Sindham) - TBD but currently leading
      player2Id: null,  // #2 of Group H - TBD
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T15:30:00Z',
      player1Source: { type: 'group', value: 'Group G', position: 1 },
      player2Source: { type: 'group', value: 'Group H', position: 2 }
    },
    {
      id: 'k5',
      round: 'round16',
      matchNumber: 5,
      player1Id: 'p5',  // #2 of Group A (Durga Tammireddy)
      player2Id: 'p13', // #1 of Group B (Sanchita Chakrabarty)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T16:00:00Z',
      player1Source: { type: 'group', value: 'Group A', position: 2 },
      player2Source: { type: 'group', value: 'Group B', position: 1 }
    },
    {
      id: 'k6',
      round: 'round16',
      matchNumber: 6,
      player1Id: 'p3',  // #2 of Group C (Arishti Salaria)
      player2Id: 'p6',  // #1 of Group D (Induja Kala)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T16:30:00Z',
      player1Source: { type: 'group', value: 'Group C', position: 2 },
      player2Source: { type: 'group', value: 'Group D', position: 1 }
    },
    {
      id: 'k7',
      round: 'round16',
      matchNumber: 7,
      player1Id: 'p20', // #2 of Group E (Tamanna Koundal)
      player2Id: 'p9',  // #1 of Group F (Manaswini Pidugu)
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T17:00:00Z',
      player1Source: { type: 'group', value: 'Group E', position: 2 },
      player2Source: { type: 'group', value: 'Group F', position: 1 }
    },
    {
      id: 'k8',
      round: 'round16',
      matchNumber: 8,
      player1Id: null,  // #2 of Group G - TBD
      player2Id: null,  // #1 of Group H - TBD
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-18T17:30:00Z',
      player1Source: { type: 'group', value: 'Group G', position: 2 },
      player2Source: { type: 'group', value: 'Group H', position: 1 }
    },
    // Quarter Finals - TBD based on Round of 16 results
    {
      id: 'k9',
      round: 'quarterfinal',
      matchNumber: 1,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T14:00:00Z',
      player1Source: { type: 'match', value: 'Winner of Match 1' },
      player2Source: { type: 'match', value: 'Winner of Match 2' }
    },
    {
      id: 'k10',
      round: 'quarterfinal',
      matchNumber: 2,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T14:30:00Z',
      player1Source: { type: 'match', value: 'Winner of Match 3' },
      player2Source: { type: 'match', value: 'Winner of Match 4' }
    },
    {
      id: 'k11',
      round: 'quarterfinal',
      matchNumber: 3,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T15:00:00Z',
      player1Source: { type: 'match', value: 'Winner of Match 5' },
      player2Source: { type: 'match', value: 'Winner of Match 6' }
    },
    {
      id: 'k12',
      round: 'quarterfinal',
      matchNumber: 4,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T15:30:00Z',
      player1Source: { type: 'match', value: 'Winner of Match 7' },
      player2Source: { type: 'match', value: 'Winner of Match 8' }
    },
    // Semi Finals
    {
      id: 'k13',
      round: 'semifinal',
      matchNumber: 1,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T16:00:00Z',
      player1Source: { type: 'match', value: 'Winner of QF1' },
      player2Source: { type: 'match', value: 'Winner of QF2' }
    },
    {
      id: 'k14',
      round: 'semifinal',
      matchNumber: 2,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T16:30:00Z',
      player1Source: { type: 'match', value: 'Winner of QF3' },
      player2Source: { type: 'match', value: 'Winner of QF4' }
    },
    // Final
    {
      id: 'k15',
      round: 'final',
      matchNumber: 1,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      status: 'upcoming',
      scheduledTime: '2025-07-19T17:00:00Z',
      player1Source: { type: 'match', value: 'Winner of SF1' },
      player2Source: { type: 'match', value: 'Winner of SF2' }
    }
  ]
};

export { tournament };
