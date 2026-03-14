import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
  }
  if (!PASSWORD_RULES.hasUppercase.test(password)) {
    errors.push('At least one uppercase letter');
  }
  if (!PASSWORD_RULES.hasLowercase.test(password)) {
    errors.push('At least one lowercase letter');
  }
  if (!PASSWORD_RULES.hasNumber.test(password)) {
    errors.push('At least one number');
  }
  return errors;
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === 'password') {
      setPasswordErrors(value ? validatePassword(value) : []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const pwErrors = validatePassword(formData.password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      setError('Please fix the password requirements below.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', formData);
      
      if (response.data.success) {
        const { tokens, user } = response.data.data;
        login(tokens.accessToken, user, tokens.refreshToken);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      const errorsArr = err.response?.data?.errors;
      if (errorsArr?.length) {
        setError(errorsArr.join('. '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-md mx-auto">
        <Card className="p-8 shadow-card">
          <h1 className="text-3xl font-bold mb-2 text-center">Create your account</h1>
            <p className="text-muted-foreground text-center mb-8">Join SkillVerse and start your journey</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@email.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                {formData.password && passwordErrors.length > 0 ? (
                  <ul className="text-[10px] text-red-500 mt-1 space-y-0.5">
                    {passwordErrors.map((err, i) => (
                      <li key={i}>✗ {err}</li>
                    ))}
                  </ul>
                ) : formData.password ? (
                  <p className="text-[10px] text-green-600 mt-1">✓ Password meets all requirements</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Min 8 characters, must include Uppercase, Lowercase, and Number.
                  </p>
                )}
              </div>
              <Button 
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
            </p>
          </Card>
        </div>
    </PageLayout>
  );
};

export default Signup;

