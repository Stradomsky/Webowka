class CurrentTaskService {
    private static instance: CurrentTaskService;
    private currentTaskId: number | null = null;

    private constructor() {
        this.loadCurrentTask();
    }
    //zwraca ingleton 'CurrentTaskService', jeśli brak - tworzy nowy
    public static getInstance(): CurrentTaskService {
        if (!CurrentTaskService.instance) {
            CurrentTaskService.instance = new CurrentTaskService();
        }
        return CurrentTaskService.instance;
    }

    public setCurrentTask(taskId: number): void {
        this.currentTaskId = taskId;
        localStorage.setItem('currentTask', taskId.toString());
    }

    public getCurrentTaskId(): number | null {
        return this.currentTaskId;
    }

    private loadCurrentTask(): void {
        const taskId = localStorage.getItem('currentTask');
        if (taskId) {
            this.currentTaskId = parseInt(taskId, 10);
        }
    }

    public clearCurrentTask(): void {
        this.currentTaskId = null;
        localStorage.removeItem('currentTask');
    }
}

export default CurrentTaskService.getInstance();
