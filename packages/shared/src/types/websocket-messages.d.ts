export interface WebSocketMessageBase {
    type: string;
}
export interface JoinMessage extends WebSocketMessageBase {
    type: 'join';
    userId: string;
}
export interface GetPlayersMessage extends WebSocketMessageBase {
    type: 'get-players';
}
export interface TestResultsMessage extends WebSocketMessageBase {
    type: 'test-results';
    passed: number;
    total: number;
}
export interface StartBattleMessage extends WebSocketMessageBase {
    type: 'start-battle';
}
export interface EndBattleMessage extends WebSocketMessageBase {
    type: 'end-battle';
    userId: string;
}
export interface BattleStatusMessage extends WebSocketMessageBase {
    type: 'battle-status';
    status: 'waiting' | 'active' | 'completed';
    isAdmin: boolean;
    battleId: string;
}
export interface PlayersListMessage extends WebSocketMessageBase {
    type: 'players-list';
    players: Player[];
}
export interface BattleStatusUpdateMessage extends WebSocketMessageBase {
    type: 'battle-status-update';
    status: 'waiting' | 'active' | 'completed' | 'no-battle';
    canJoin?: boolean;
    isActive?: boolean;
    isWaiting?: boolean;
    isCompleted?: boolean;
    connectedPlayers?: number;
    participantCount?: number;
    startedAt?: string;
    change?: string;
}
export interface BattleStartedMessage extends WebSocketMessageBase {
    type: 'battle-started';
    battleId: string;
    startedBy: string;
    startedAt: string;
}
export interface BattleCompletedMessage extends WebSocketMessageBase {
    type: 'battle-completed';
    battleId: string;
    results: BattleResult[];
    endedBy: string;
}
export interface TestResultsUpdateMessage extends WebSocketMessageBase {
    type: 'test-results-update' | 'test-results';
    userId: string;
    passed: number;
    total: number;
}
export interface CurrentQuestionMessage extends WebSocketMessageBase {
    type: 'current-question';
    question: Question;
}
export interface QuestionPoolMessage extends WebSocketMessageBase {
    type: 'question-pool';
    questions: QuestionSummary[];
}
export interface BattleInfoMessage extends WebSocketMessageBase {
    type: 'battle-info';
    battle: BattleInfo;
}
export interface ErrorMessage extends WebSocketMessageBase {
    type: 'error';
    message: string;
}
export type ClientMessage = JoinMessage | GetPlayersMessage | TestResultsMessage | StartBattleMessage | EndBattleMessage;
export type ServerMessage = BattleStatusMessage | PlayersListMessage | BattleStatusUpdateMessage | BattleStartedMessage | BattleCompletedMessage | TestResultsUpdateMessage | CurrentQuestionMessage | QuestionPoolMessage | BattleInfoMessage | ErrorMessage;
export type WebSocketMessage = ClientMessage | ServerMessage;
export interface Player {
    userId: string;
    testsPassed: number;
    totalTests: number;
    joinedAt: string;
    isConnected: boolean;
}
export interface BattleResult {
    userId: string;
    testsPassed: number;
    totalTests: number;
    completedAt: string;
}
export interface Question {
    [key: string]: unknown;
}
export interface QuestionSummary {
    [key: string]: unknown;
}
export interface BattleInfo {
    isAdmin?: boolean;
    status?: 'waiting' | 'active' | 'completed';
    scheduledStartTime?: string;
    questionPool?: unknown[];
}
