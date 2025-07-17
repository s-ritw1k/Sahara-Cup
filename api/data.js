// Tournament data for API
const tournament = {
  id: 'sahara-cup-2025',
  name: 'Sahara Cup 2025',
  description: 'Annual Table Tennis Tournament',
  startDate: '2025-07-15T09:00:00Z',
  endDate: '2025-07-18T18:00:00Z',
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
    { id: 'p13', name: 'Sanchita Chakrabarty Ma\'am', email: 'sanchita@company.com' },
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
    // Group A matches
    {
      id: 'm1',
      player1Id: 'p21', // Treesa James
      player2Id: 'p8',  // Krishna Ramya
      player1Score: 2,
      player2Score: 0,
      scheduledTime: '2025-07-17T10:00:00Z',
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
      scheduledTime: '2025-07-17T11:00:00Z',
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
      scheduledTime: '2025-07-17T12:00:00Z',
      status: 'completed',
      groupId: 'g1',
      winnerId: 'p21',
      round: 1
    },
    // Group B matches
    {
      id: 'm4',
      player1Id: 'p13', // Sanchita Chakrabarty
      player2Id: 'p15', // Shreeya Dheera Parvatham
      player1Score: 2,
      player2Score: 1,
      scheduledTime: '2025-07-17T10:30:00Z',
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
      scheduledTime: '2025-07-17T11:30:00Z',
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
      scheduledTime: '2025-07-17T12:30:00Z',
      status: 'completed',
      groupId: 'g2',
      winnerId: 'p1',
      round: 1
    },
    // Group C matches
    {
      id: 'm7',
      player1Id: 'p3',  // Arishti Salaria
      player2Id: 'p19', // Srija Panyala
      player1Score: 1,
      player2Score: 2,
      scheduledTime: '2025-07-17T13:00:00Z',
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
      scheduledTime: '2025-07-17T13:30:00Z',
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
      scheduledTime: '2025-07-17T14:00:00Z',
      status: 'completed',
      groupId: 'g3',
      winnerId: 'p19',
      round: 1
    },
    // Group D matches
    {
      id: 'm10',
      player1Id: 'p6',  // Induja Kala
      player2Id: 'p12', // Sai Keerthi Tulluru
      player1Score: 2,
      player2Score: 0,
      scheduledTime: '2025-07-17T14:30:00Z',
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
      scheduledTime: '2025-07-17T15:00:00Z',
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
      scheduledTime: '2025-07-17T15:30:00Z',
      status: 'completed',
      groupId: 'g4',
      winnerId: 'p6',
      round: 1
    },
    // Group E matches
    {
      id: 'm13',
      player1Id: 'p22', // Tulsi Pratyusha Dintyala
      player2Id: 'p24', // Yadavalli Dedeepya Sneha
      player1Score: 2,
      player2Score: 0,
      scheduledTime: '2025-07-17T16:00:00Z',
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
      scheduledTime: '2025-07-17T16:30:00Z',
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
      scheduledTime: '2025-07-17T17:00:00Z',
      status: 'completed',
      groupId: 'g5',
      winnerId: 'p20',
      round: 1
    },
    // Group F matches
    {
      id: 'm16',
      player1Id: 'p2',  // Anusha Reddy Bakaram
      player2Id: 'p9',  // Manaswini Pidugu
      player1Score: 0,
      player2Score: 2,
      scheduledTime: '2025-07-17T17:30:00Z',
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
      scheduledTime: '2025-07-17T18:00:00Z',
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
      scheduledTime: '2025-07-17T18:30:00Z',
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
      scheduledTime: '2025-07-17T19:00:00Z',
      status: 'completed',
      groupId: 'g7',
      winnerId: 'p23',
      round: 1
    },
    // Group G - Remaining matches TBD (Vaishnavi vs Rubeena, Rubeena vs Sri Indu)
    {
      id: 'm20',
      player1Id: 'p23', // Vaishnavi Sindham
      player2Id: 'p11', // Rubeena Khatun
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-18T10:00:00Z',
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
      scheduledTime: '2025-07-18T10:30:00Z',
      status: 'upcoming',
      groupId: 'g7',
      round: 1
    },
    // Group H matches - upcoming
    {
      id: 'm22',
      player1Id: 'p7',  // Jyothi M
      player2Id: 'p14', // Sanu Gupta
      player1Score: 0,
      player2Score: 0,
      scheduledTime: '2025-07-18T11:00:00Z',
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
      scheduledTime: '2025-07-18T11:30:00Z',
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
      scheduledTime: '2025-07-18T12:00:00Z',
      status: 'upcoming',
      groupId: 'g8',
      round: 1
    }
  ],
  knockoutMatches: []
};

export { tournament };
