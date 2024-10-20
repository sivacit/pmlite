/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma } from '../../prisma';
import { AbstractSeed } from '../seed.abstract';
import { CREATE_USER_NUM, generateUser } from './user-seeds';

const userId = 'usrTestUserId';

const spaceId = 'spcTestSpaceId';
const spaceName = 'test space';

const baseId = 'bseTestBaseId';
const baseName = 'test base';

const collaboratorId = 'usrTestCollaboratorId';
const generateProject1 = (): Prisma.ProjectCreateInput => {
  return {
    id: 'project1',
    name: 'Project Management Tool',
    credit: 100,
    createdBy: 'user1@example.com',
    tasks: {
      create: [
        {
          title: 'Design the database schema',
          status: 'Completed',
          deadline: new Date('2024-10-25'),
          user: { connect: { id: 'usrTestUserId' } },
        },
        {
          title: 'Set up the NestJS backend',
          status: 'In Progress',
          deadline: new Date('2024-11-01'),
          user: { connect: { id: 'usrTestUserId_1' } },
        },
      ],
    },
  };
};

const generateProject2 = (): Prisma.ProjectCreateInput => {
  return {
    id: 'project2',
    name: 'Marketing Automation',
    credit: 250,
    createdBy: 'user2@example.com',
    deletedTime: null,
    tasks: {
      create: [
        {
          title: 'Prepare marketing strategy',
          status: 'Not Started',
          deadline: new Date('2024-12-01'),
          user: { connect: { id: 'user3' } },
        },
        {
          title: 'Develop campaign tracking system',
          status: 'In Progress',
          deadline: new Date('2024-11-15'),
          user: { connect: { id: 'user4' } },
        },
      ],
    },
  };
};

// const generateTask = (): Prisma.Task => {
//   return {
//     title: 'Prepare marketing strategy',
//     status: 'Not Started',
//     deadline: new Date('2024-12-01'),
//     project: { connect: { id: 'project2' } },
//     user: { connect: { id: 'user3' } },
//   };
// };

// export const generateCollaborator = async (
//   connectUserNum: number,
// ): Promise<Prisma.CollaboratorUncheckedCreateInput[]> => {
//   const userSets = await generateUser(connectUserNum);

//   return Array.from({ length: connectUserNum + 1 }, (_, i) => ({
//     id: `${collaboratorId}_${i}`,
//     resourceId: spaceId,
//     resourceType: 'space',
//     roleName: 'owner',
//     userId: userSets[i].id!,
//     createdBy: userSets[i].id!,
//   }));
// };

export class ProjectSeeds extends AbstractSeed {
  execute = async (): Promise<void> => {
    await this.prisma.$transaction(async (tx) => {
      // Project
      await this.createProject1(tx);

      // await this.createProject2(tx);

      // Tasks
      // await this.createTitle(tx);

      // Collaborator
      // await this.createCollaborator(tx);
    });
  };

  private async createProject1(tx: Prisma.TransactionClient) {
    const { id: spaceId, ...spaceNonUnique } = generateProject1();
    const space = await tx.project.upsert({
      where: { id: spaceId },
      update: spaceNonUnique,
      create: { id: spaceId, ...spaceNonUnique },
    });
    this.log('UPSERT', `Space ${space.id} - ${space.name}`);
  }

  private async createProject2(tx: Prisma.TransactionClient) {
    const { id: spaceId, ...spaceNonUnique } = generateProject2();
    const space = await tx.project.upsert({
      where: { id: spaceId },
      update: spaceNonUnique,
      create: { id: spaceId, ...spaceNonUnique },
    });
    this.log('UPSERT', `Space ${space.id} - ${space.name}`);
  }

  // private async createTitle(tx: Prisma.TransactionClient) {
  //   const { id: baseId, ...baseNonUnique } = generateTask();
  //   const base = await tx.task.upsert({
  //     where: { id: baseId },
  //     update: baseNonUnique,
  //     create: { id: baseId, ...baseNonUnique },
  //   });
  //   this.log('UPSERT', `Base ${base.id} - ${base.title}`);

  //   if (this.driver !== 'sqlite3') {
  //     await tx.$executeRawUnsafe(`create schema if not exists "${baseId}"`);
  //     await tx.$executeRawUnsafe(
  //       `revoke all on schema "${baseId}" from public`,
  //     );
  //   }
  // }

  // private async createCollaborator(tx: Prisma.TransactionClient) {
  //   const collaboratorSets = await generateCollaborator(CREATE_USER_NUM);
  //   for (const c of collaboratorSets) {
  //     const { id, resourceId, userId, ...collaboratorNonUnique } = c;
  //     const collaborator = await tx.collaborator.upsert({
  //       where: { id, resourceId, resourceType: 'space', userId },
  //       update: collaboratorNonUnique,
  //       create: c,
  //     });
  //     this.log(
  //       'UPSERT',
  //       `Collaborator ${collaborator.id} - ${collaborator.resourceId} - ${collaborator.userId}`,
  //     );
  //   }
  // }
}
