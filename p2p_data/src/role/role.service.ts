import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { RoleRepository } from '../role/role.repository';


@Injectable()
export class RoleService {

    constructor(
        @Inject(RoleRepository)
        private readonly roleRepository: RoleRepository,
    ) { }

    // Search all roles
    async GetAllRoles(): Promise<Role[]> {
        const roles = await this.roleRepository.GetAllRoles();
        if (!roles) {
            throw new Error("Erreur, roles non trouvée !");
        }
        return [...roles];
    }

    // Search one role by ID
    async GetRoleById(roleId: number): Promise<Role> {
        const role = await this.roleRepository.GetRoleById(roleId);
        if (!role) {
            throw new Error("Erreur, role non trouvée !");
        }
        return { ...role };
    }

    // Create one role if didn't exist
    async createRole(
        idRole: number,
        name: string,
        isActive: boolean
    ): Promise<Role> {

        const roleInBdd = await this.roleRepository.GetRoleByName(name);
        if (roleInBdd) {
            throw new Error("Erreur : ce role existe déjà !");
        } else {
            const newRole = await this.roleRepository.CreateRole(name, isActive);
            return { ...newRole }
        }
    }

    // Update one role
    async updateRole(idRole : number, name: string, isActive: boolean ): Promise<Role> {
        const roleInBdd = await this.roleRepository.GetRoleById(idRole);
        if (!roleInBdd) {
            throw new NotFoundException('role to update not found');
        }
        else {
            const roleUpdated = await this.roleRepository.updateRole(idRole, name, isActive);
            return roleUpdated;
        }
    }

    // Delete one role
    async deleteRole(roleId: number): Promise<string> {
        const deletedRole = await this.roleRepository.deleteRole(roleId);
        return deletedRole
    } 
}
