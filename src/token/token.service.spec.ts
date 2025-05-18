import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('TokenService', () => {
  let service: TokenService;

  const mockPrismaService = {
    token: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createConfirmToken', () => {
    it('should create a token and return it', async () => {
      const mockDate = new Date();
      const fakeNow = mockDate.getTime();

      jest.spyOn(global.Date, 'now').mockImplementation(() => fakeNow);

      await service.createConfirmToken(123);

      expect(mockPrismaService.token.create).toHaveBeenCalledWith({
        data: {
          token: 'mocked-uuid',
          subscriptionId: 123,
          expiresAt: new Date(fakeNow + 1000 * 60 * 60 * 24),
        },
      });

      expect(await service.createConfirmToken(123)).toEqual('mocked-uuid');

      jest.restoreAllMocks();
    });
  });

  describe('getValidToken', () => {
    it('should return token if found', async () => {
      const tokenRecord = { id: 1, token: 'abc', subscriptionId: 42 };
      mockPrismaService.token.findUnique.mockResolvedValue(tokenRecord);

      const result = await service.getValidToken('abc');

      expect(mockPrismaService.token.findUnique).toHaveBeenCalledWith({
        where: { token: 'abc' },
      });
      expect(result).toEqual(tokenRecord);
    });

    it('should throw BadRequestException if token not found', async () => {
      mockPrismaService.token.findUnique.mockResolvedValue(null);

      await expect(service.getValidToken('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
