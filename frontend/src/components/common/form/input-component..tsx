import { useController } from "react-hook-form"
import Select from "react-select"

export interface InputLabelProps{
    children: any, 
    htmlFor: string
}
export const InputLabel = ({children, htmlFor}: InputLabelProps) => {
    return(
        <>
        <label htmlFor={htmlFor} className="block text-sm font-medium  text-gray-700"> {children} </label>
        </>
    )
}
export interface TextInputInterface {
    control: any
    name: string
    defaultValue?: string | undefined
    errMsg?: string | null
    type?: string
    row?:number
    onChange?: any
}
export interface ImageInputInterface{
    type: any
    name:string
    errMsg?: string 
    control: any
    onChange: any
}
export const TextInputComponent = ({type="text",control,name, defaultValue, errMsg=null}: TextInputInterface) => {
    const {field} = useController({
        control: control,
        name:name,
        defaultValue: defaultValue,
      
    })
    return(
        <>
        <input
              type={type}           
              {...field}
            className={`mt-1 w-full rounded-md  ${errMsg? 'border-red-500' : 'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm focus:border-violet-600 focus:ring-violet-600`}
            />
            <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}

export const NumberInputComponent = ({type="number",control,name, defaultValue, errMsg=null}: TextInputInterface) => {
    const {field} = useController({
        control: control,
        name:name,
        defaultValue: defaultValue?? undefined,
      
    })
    return(
        <>
        <input
              type={type}           
              {...field}
            className={`mt-1 w-full rounded-md  ${errMsg? 'border-red-500' : 'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm focus:border-violet-600 focus:ring-violet-600`}
            />
            <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}

export const OTPInputComponent = ({type="number",control,name, onChange, defaultValue, errMsg=null}: TextInputInterface) => {
    const {field} = useController({
        control: control,
        name:name,
        defaultValue: defaultValue?? undefined,
    })
    return(
        <>
        <input
              type={type}
              {...field}
              onChange={(e) => {
                  field.onChange(e)
                  if (onChange) onChange(e)
              }}
            className={`mt-1 w-full rounded-md text-center text-lg tracking-widest  ${errMsg? 'border-red-500' : 'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm focus:border-violet-600 focus:ring-violet-600`}
            />
            <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}


export const TextAreaInputComponent = ({row=5,control,name, defaultValue,  errMsg=null}: TextInputInterface) => {
    const {field} = useController({
        control: control,
        name:name,
        defaultValue: defaultValue,
       
    })
    return(
        <>
       <textarea 
       {...field}
       rows={row} 
       style={{resize:"none"}} 
       className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm">{defaultValue}</textarea>
            <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}
export interface OptionTpye{
    label: string,
    value:string 
}
export interface SelectOptionProps{
    control:any
    name: string
   
    errMsg?: string
    options?: Array<OptionTpye>
}
export const SelectOptionComponent = ({options,control, name, errMsg=""}: SelectOptionProps) => {
    const {field} = useController({
        name: name,
        control: control,      
       
    })
    return(
        <>
        <select
             {...field}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:border-violet-600 focus:ring-violet-600"
            >
                {
                options && options.map((row:OptionTpye, i:number)=>(
                    <option key={i} value={row.value}>{row.label}</option>
                ))
            }
          </select>
          <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}

export const SelectComponent = ({options,control, name, errMsg=""}: SelectOptionProps) => {
    const {field} = useController({
        name: name,
        control: control,      
       
    })
    return(
        <>
        <Select options={options} {...field}  className=" mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:border-violet-600 focus:ring-violet-600 " />
        
          <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
        </>
    )
}

export const RoleSelectComponent = ({control, name, errMsg=""}: SelectOptionProps) => {
    return(
        <>
        <SelectOptionComponent
        options= {
            [{label:"Buyer",value:"customer"},{label:"Seller",value:"seller"}]
        }
        control={control}
         name={name}
    
          errMsg={errMsg}
        />
        </>
    )
}

export const StatusSelectComponent = ({control, name, errMsg=""}:SelectOptionProps) => {
return(
    <>
     <SelectComponent
        options= {
            [{label:"Publish",value:"active"},{label:"Unpublish",value:"inactive"}]
        }
        control={control}
         name={name}
    
          errMsg={errMsg}
        />
    </>
)
}


export const SubmitButton = ({loading = false, children}: {loading:boolean, children : any}) => {
    return (
        <>
          <button disabled={loading} type="submit" className="disabled:cursor-not-allowed disabled:bg-violet-300 mx-3 inline-flex items-center px-5 py-3 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-violet-700 rounded-lg focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-900 hover:bg-violet-800">
            {children}
        </button>
        </>
    )
}

export const CancelButton = ({loading = false, children}: {loading:boolean, children : any}) => {
    return (
        <>
          <button disabled={loading} type="submit" className="disabled:cursor-not-allowed mx-3 op disabled:bg-red-300 inline-flex items-center px-5 py-3 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800">
            {children}
        </button>
        </>
    )
}
export const ImageUpload = ({control,errMsg="",type="file",name}:ImageInputInterface) => { //onchange
    const {field: { onChange, ...restField },} = useController({
        control :control,
        name:name,
    });
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          onChange(file); 
        }
      };
    return(
        <>
        <input
        {...restField}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
       accept="image/*"
        onChange={handleImageChange}
        type={type}
        name={name}
      ></input>
      <span className="text-sm italic text-red-800">
             {errMsg}
            </span>
      </>
    )
    }
