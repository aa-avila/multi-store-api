import { JwtService } from '@nestjs/jwt';

export const jwtCreator = (user: any): Promise<string> => {
  const payload = { ...user };
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
  return jwtService.signAsync(payload, { expiresIn: '1h' });
};
