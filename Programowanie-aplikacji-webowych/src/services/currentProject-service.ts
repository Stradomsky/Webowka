
import { selectedProjectId } from "../reactive/refs"

class CurrentProjectService {
  private static instance: CurrentProjectService;

  private constructor() {
    this.loadCurrentProject();
  }
  
  //zwraca ingleton 'CurrentProjetService', jeśli brak - tworzy nowy
  public static getInstance(): CurrentProjectService {
    if (!CurrentProjectService.instance) {
      CurrentProjectService.instance = new CurrentProjectService();
    }
    return CurrentProjectService.instance;
  }

  public setCurrentProject(projectId: number): void {
    selectedProjectId.value = projectId;
    localStorage.setItem('currentProject', projectId.toString());
  }

  public getCurrentProjectId(): number | null {
    return selectedProjectId.value;
  }

  private loadCurrentProject(): void {
    const projectId = localStorage.getItem('currentProject');
    if (projectId) {
      selectedProjectId.value = parseInt(projectId);
    }
  }

  public clearCurrentProject(): void {
    selectedProjectId.value = null;
    localStorage.removeItem('currentProject');
  }


}

export default CurrentProjectService.getInstance();