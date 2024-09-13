class CurrentStoryService {
    private static instance: CurrentStoryService;
    private currentStoryId: number | null = null;
  
    private constructor() {
      this.loadCurrentStory();
    }
    //zwraca ingleton 'CurrentStoryService', jeśli brak - tworzy nowy
    public static getInstance(): CurrentStoryService {
      if (!CurrentStoryService.instance) {
        CurrentStoryService.instance = new CurrentStoryService();
      }
      return CurrentStoryService.instance;
    }
  
    public setCurrentStory(storyId: number): void {
      this.currentStoryId = storyId;
      localStorage.setItem('currentStory', storyId.toString());
    }
  
    public getCurrentStoryId(): number | null {
      return this.currentStoryId;
    }
  
    private loadCurrentStory(): void {
      const storyId = localStorage.getItem('currentStory');
      if (storyId) {
        this.currentStoryId = parseInt(storyId, 10);
      }
    }
  
    public clearCurrentStory(): void {
      this.currentStoryId = null;
      localStorage.removeItem('currentStory');
    }
  }
  
  export default CurrentStoryService.getInstance();
  