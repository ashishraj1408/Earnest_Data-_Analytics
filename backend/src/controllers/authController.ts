import { Request, Response } from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../services/authService';
import { validateRegisterInput, validateLoginInput } from '../utils/validators';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const errors = validateRegisterInput(email, password);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await registerUser({ email, password });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const errors = validateLoginInput(email, password);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await loginUser({ email, password });
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a real app, you'd invalidate the refresh token
  res.json({ message: 'Logged out successfully' });
};