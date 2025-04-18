"use client"; 

import {zodResolver} from '@hookform/resolvers/zod';
import { ZodType} from 'zod';
import {DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn} from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import  Link  from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import FileUpload from './FileUpload';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
                             // interfece define types of props comming into these fun.
                             // T generic parameter that extends the FormValues
interface Props<T extends FieldValues> {
    type: 'SIGN_IN' | 'SIGN_UP';
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean ; error?: string}>;
}

const AuthForm =<T extends FieldValues> ({
    type, 
    schema, 
    defaultValues, 
    onSubmit
}: Props<T>) => {
                               
    const router = useRouter();

    const isSignIn = type === 'SIGN_IN';

    const form: UseFormReturn<T>= useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result= await onSubmit(data);
        if(result.success){
            toast({
                title: 'Success',
                description: isSignIn ? 'Log In Successfully' : 'Signed Up Successfully',
            });

            router.push("/");
        }else{
            toast({
                title: `Error ${isSignIn ? "signing in" : "signing up"}`,
                description: result.error ?? "An error occurred.",
                variant: "destructive",
        
            })
        }
    };
  
    return(
    <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold text-light-200'>
            {isSignIn ? 'Welcome back to BorrowClub' : 'Create an account'}
        </h1>
        <p className='text-light-100'>
                {isSignIn 
                    ? "Access the resources"
                    : "Create an account to access the resources and complete all fields"
                }
        </p>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full space-y-6"
            >
                
                {Object.keys(defaultValues).map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="capitalize">
                                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                </FormLabel>
                                <FormControl>
                                    {field.name === "universityCard" ? (
                                        <FileUpload 
                                            type="image"
                                            accept="image/*"
                                            placeholder="Upload your ID"
                                            folder="ids"
                                            variant="dark"
                                            onFileChange={field.onChange}
                                        />
                
                                    ) : (
                                        <Input
                                            required
                                            type={
                                            FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                                            }
                                            {...field}
                                            className="form-input"
                                        />
                                    )}
                                    </FormControl>       
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <Button type="submit" className="form-btn">
                    {isSignIn ? "Log In" : "Sign Up"}
                </Button>
            </form>
        </Form>
      <p className='text-center text-base font-medium '>
        {isSignIn ? 'New to BorrowClub?' : 'Already have an account?'}
        
        <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="ml-3 font-bold text-primary">
            {isSignIn ? 'Sign Up' : 'Log In'}
        </Link>
        
      </p>
    </div>
       
    );                                                   
};

export default AuthForm