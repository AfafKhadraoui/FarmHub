// Types for profile responses from backend

export type FarmerProfile = {
	id: number | string;
	name: string;
	email: string;
	phone?: string | null;
	role: string; // e.g. 'admin' or other
	farmId?: number | null;
	farmName?: string | null;
	avatar?: string | null;
	createdAt?: string;
};

export type AssignedFarm = {
	id: string; // backend uses prefixed id like 'farm_1'
	name: string;
	owner?: number | string;
};

export type WorkerStatistics = {
	totalTasksCompleted: number;
	totalHoursWorked: number;
	averageRating: number;
};

export type WorkerProfile = {
	id: string; // 'worker_<id>'
	name: string;
	email: string;
	phone?: string | null;
	avatar?: string | null;
	role: 'WORKER' | string;
	joinedDate?: string;
	assignedFarms?: AssignedFarm[];
	statistics?: WorkerStatistics;
};

export type Profile = FarmerProfile | WorkerProfile;

export type UpdateProfileRequest = {
	name?: string;
	phone?: string | null;
	avatar?: string | null;
};

export type ChangePasswordRequest = {
	currentPassword: string;
	newPassword: string;
	confirmationPassword: string;
};
