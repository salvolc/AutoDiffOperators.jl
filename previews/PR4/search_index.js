var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/#Modules","page":"API","title":"Modules","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Order = [:module]","category":"page"},{"location":"api/#Types-and-constants","page":"API","title":"Types and constants","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Order = [:type, :constant]","category":"page"},{"location":"api/#Functions-and-macros","page":"API","title":"Functions and macros","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Order = [:macro, :function]","category":"page"},{"location":"api/#Documentation","page":"API","title":"Documentation","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [AutoDiffOperators]\nOrder = [:module, :type, :constant, :macro, :function]","category":"page"},{"location":"api/#AutoDiffOperators.AutoDiffOperators","page":"API","title":"AutoDiffOperators.AutoDiffOperators","text":"AutoDiffOperators\n\nProvides Julia operators that act via automatic differentiation.\n\n\n\n\n\n","category":"module"},{"location":"api/#AutoDiffOperators.ADModule","page":"API","title":"AutoDiffOperators.ADModule","text":"struct ADModule{m}\n\nSpeficies and automatic differentiation backend via it's module name.\n\nWe recommend to use the AD-backend types defined in AbstractDifferentiation.jl and [ADTypes.jl}(https://github.com/SciML/ADTypes.jl) instead of ADModule. The function convert_ad provides a conversion mechanism between all of these different AD-backend-speficiers.\n\nExamples:\n\nADModule(:ForwardDiff)\nADModule(:Zygote)\n\nCan be converted to a Val for compatibily with approaches like LogDensityProblemsAD.ADgradient (see LogDensityProblemsAD):\n\nVal(ADModule(:ForwardDiff)) == Val(:ForwardDiff)\n\nConstructing an instance of ADModule will fail if the package hosting the corresponding module is not loaded (either directly, or indirectly via dependencies of other loaded packages).\n\nModule(ad::ADModule) returns the Module object that corresponds to ad.\n\n\n\n\n\n","category":"type"},{"location":"api/#AutoDiffOperators.AdjointMatrixLikeOperator","page":"API","title":"AutoDiffOperators.AdjointMatrixLikeOperator","text":"struct AutoDiffOperators.AdjointMatrixLikeOperator{T<:Number,sym,herm,posdef} <: MatrixLikeOperator{T,sym,herm,posdef}\n\nRepresents the adjoint of a MatrixLikeOperator.\n\nUser code should not instantiate this type directly, use adjoint(::MatrixLikeOperator) instead.\n\n\n\n\n\n","category":"type"},{"location":"api/#AutoDiffOperators.FwdRevADSelector","page":"API","title":"AutoDiffOperators.FwdRevADSelector","text":"AutoDiffOperators.FwdRevADSelector{Fwd<:ADSelector,Rev<:ADSelector} <: ADSelector\n\nRepresent an automatic differentiation backend that forwards forward-mode and reverse-mode AD to two separate selectors fwd::ADSelector and rev::ADSelector.\n\nUser code should not instantiate AutoDiffOperators.FwdRevADSelector directly, but use ADSelector(fwd, rev) or ADSelector(fwd = fwd, rev = rev) instead.\n\n\n\n\n\n","category":"type"},{"location":"api/#AutoDiffOperators.MatrixLikeOperator","page":"API","title":"AutoDiffOperators.MatrixLikeOperator","text":"abstract type MatrixLikeOperator{T<:Number} <: AbstractMatrix{T} end\n\nAbstract type for matrix-like operators that support multiplication with vectors.\n\nAn op::MatrixLikeOperator can be constructed from a multiplication function op_mul(x) that implements op * x, and ajoint multiplication function adjoint_op_mul(x) that implements op' * x, and a size sz via\n\nMatrixLikeOperator(\n    ovp, op_mul_function, adjoint_op_mul_function, sz::Dims\n    issymmetric::Bool, ishermitian::Bool, isposdef::Bool\n)\n\nTypically specialized subtypes of MatrixLikeOperator should be used for specific kinds of operators, though.\n\nMatrixLikeOperator supports conversion to LinearMaps.jl operator types via constructor and convert methods:\n\nLinearMaps.FunctionMap(op::MatrixLikeOperator) isa LinearMaps.FunctionMap\nLinearMaps.LinearMap(op::MatrixLikeOperator) isa LinearMaps.FunctionMap\n\nSubtypes must implement:\n\nBase.size(op::MatrixLikeOperator)\nAutoDiffOperators.op_mul(op::MatrixLikeOperator, x::AbstractVector{<:Number})\nAutoDiffOperators.adjoint_op_mul(op::MatrixLikeOperator, x::AbstractVector{<:Number})\n\nAnd may implement, resp. specialize (if possible):\n\nBase.adjoint(op::MatrixLikeOperator)\nBase.transpose(op::MatrixLikeOperator)\nAutoDiffOperators.transpose_op_mul(op::MatrixLikeOperator, x::AbstractVector{<:Number})\n\n\n\n\n\n","category":"type"},{"location":"api/#AutoDiffOperators.ADSelector","page":"API","title":"AutoDiffOperators.ADSelector","text":"const ADSelector = Union{\n    AbstractDifferentiation.AbstractBackend,\n    ADTypes.AbstractADType,\n    ADModule\n}\n\nInstances speficy an automatic differentiation backend.\n\nUnifies the AD-backend selector types defined in AbstractDifferentiation.jl and [ADTypes.jl}(https://github.com/SciML/ADTypes.jl), as well as AutoDiffOperators.ADModule.\n\nAutoDiffOperators currently supports the following AD-backends, and its functions will, in general, accept any subtype of ADSelector as AD-selectors that match them:\n\nForwardDiff\nZygote\n\nSome operations that specifically require forward-mode or reverse-mode AD will only accept a subset of these backends though.\n\nThe following functions must be specialized for subtypes of ADSelector: convert_ad, with_jvp, with_vjp_func and AutoDiffOperators.supports_structargs\n\nDefault implementations are provided for jacobian_matrix and with_gradient, but specialized implementations may often be more performant.\n\nSelector types that forward forward and reverse-mode ad to other selector types should specialize forward_ad_selector and reverse_ad_selector.\n\n\n\n\n\n","category":"type"},{"location":"api/#AutoDiffOperators.adjoint_op_mul","page":"API","title":"AutoDiffOperators.adjoint_op_mul","text":"adjoint_op_mul(op::MatrixLikeOperator, x::AbstractVector{<:Number})\n\nReturns op' * x.\n\nFor details, see MatrixLikeOperator.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.convert_ad","page":"API","title":"AutoDiffOperators.convert_ad","text":"convert_ad(::Type{AbstractDifferentiation.AbstractBackend}, ad::ADSelector)\nconvert_ad(::Type{ADTypes.AbstractADType}, ad::ADSelector)\nconvert_ad(::Type{ADModule}, ad::ADSelector)\n\nConverts AD-backend selector types between AbstractDifferentiation.jl, ADTypes.jl and AutoDiffOperators.ADModule.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.forward_ad_selector","page":"API","title":"AutoDiffOperators.forward_ad_selector","text":"forward_ad_selector(ad::ADSelector)::ADSelector\n\nReturns the forward-mode AD backen selector for ad.\n\nReturns ad itself by default. Also see FwdRevADSelector.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.gradient!_func","page":"API","title":"AutoDiffOperators.gradient!_func","text":"gradient!_func(f, ad::ADSelector)\n\nReturns a tuple (f, ∇f!) with the functions f(x) and ∇f!(δx, x).\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.gradient_func","page":"API","title":"AutoDiffOperators.gradient_func","text":"gradient_func(f, ad::ADSelector)\n\nReturns a tuple (f, ∇f) with the functions f(x) and ∇f(x).\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.jacobian_matrix","page":"API","title":"AutoDiffOperators.jacobian_matrix","text":"jacobian_matrix(f, x, ad::ADSelector)\n\nReturns the explicit Jacobian matrix of f at x\n\nThe Jacobian matrix is computed using the automatic differentiation backend selected by ad.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.jvp_func-Tuple{Any, Any, ADSelector}","page":"API","title":"AutoDiffOperators.jvp_func","text":"jvp_func(f, x, ad::ADSelector)\n\nReturns a function jvp with jvp(z) == J * z.\n\n\n\n\n\n","category":"method"},{"location":"api/#AutoDiffOperators.op_mul","page":"API","title":"AutoDiffOperators.op_mul","text":"op_mul(op::MatrixLikeOperator, x::AbstractVector{<:Number})\n\nReturns op * x.\n\nFor details, see MatrixLikeOperator.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.reverse_ad_selector","page":"API","title":"AutoDiffOperators.reverse_ad_selector","text":"reverse_ad_selector(ad::ADSelector)::ADSelector\n\nReturns the reverse-mode AD backen selector for ad.\n\nReturns ad itself by default. Also see FwdRevADSelector.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.supports_structargs","page":"API","title":"AutoDiffOperators.supports_structargs","text":"AutoDiffOperators.supports_structargs(ad::ADSelector)::Boolean\n\nReturns true if ad supports structured function arguments or false if ad only supports vectors of real numbers.\n\nSince ad may use different backends for forward- and reverse-mode AD, use supports_structargs(forward_ad_selector(ad)) and  supports_structargs(reverse_ad_selector(ad)) to check if ad supports structured arguments for the desired operation.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.valgrad_func","page":"API","title":"AutoDiffOperators.valgrad_func","text":"valgrad_func(f, ad::ADSelector)\n\nReturns a function f_∇f that calculates the value and gradient of f at given points, so that f_∇f(x) is equivalent to with_gradient(f, x, ad).\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.with_gradient","page":"API","title":"AutoDiffOperators.with_gradient","text":"with_gradient(f, x, ad::ADSelector)\n\nReturns a tuple (f(x), ∇f(x)) with the gradient ∇f(x) of f at x.\n\nSee also with_gradient!!(f, δx, x, ad) for the \"maybe-in-place\" variant of this function.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.with_gradient!!","page":"API","title":"AutoDiffOperators.with_gradient!!","text":"with_gradient!!(f, δx, x, ad::ADSelector)\n\nReturns a tuple (f(x), ∇f(x)) with the gradient ∇f(x)offatx`.\n\nδx may or may not be reused/overwritten and returned as ∇f(x).\n\nThe default implementation falls back to with_gradient(f, x, ad), subtypes of ADSelector may specialized with_gradient!! to provide more efficient implementations.\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.with_jacobian-Union{Tuple{T}, Tuple{Any, AbstractVector{T}, ADSelector}} where T","page":"API","title":"AutoDiffOperators.with_jacobian","text":"with_jacobian(f, x, ad::ADSelector)\n\nReturns a tuple (f(x), J) with a multiplicative Jabobian operator `J.\n\nJ behaves like jacobian_matrix(f, x, ad) in respect to multiplication:\n\ny, J = with_jacobian(f, x, ad)\ny == f(x)\nJ_explicit = jacobian_matrix(f, x, ad)\nJ * z ≈ J_explicit * z\nz * J ≈ z * J_explicit\n\nThe default implementation of with_jacobian relies on with_vjp_func and jvp_func.\n\n\n\n\n\n","category":"method"},{"location":"api/#AutoDiffOperators.with_jvp","page":"API","title":"AutoDiffOperators.with_jvp","text":"with_jvp(f, x, z, ad::ADSelector)\n\nReturns a tuple (f(x), J * z).\n\n\n\n\n\n","category":"function"},{"location":"api/#AutoDiffOperators.with_vjp_func","page":"API","title":"AutoDiffOperators.with_vjp_func","text":"with_vjp_func(f, x, ad::ADSelector)\n\nReturns a tuple (f(x), vjp) with the function vjp(z) ≈ J' * z.\n\n\n\n\n\n","category":"function"},{"location":"LICENSE/#LICENSE","page":"LICENSE","title":"LICENSE","text":"","category":"section"},{"location":"LICENSE/","page":"LICENSE","title":"LICENSE","text":"using Markdown\nMarkdown.parse_file(joinpath(@__DIR__, \"..\", \"..\", \"LICENSE.md\"))","category":"page"},{"location":"#AutoDiffOperators.jl","page":"Home","title":"AutoDiffOperators.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides multiplicative operators that act via automatic differentiation (AD).","category":"page"},{"location":"","page":"Home","title":"Home","text":"AutoDiffOperators.jl uses AD-backend abstractions and supports a subset of the AD-backends specifiers in both AbstractDifferentiation.jl and ADTypes.jl. Support for additional AD-backends is planned.","category":"page"},{"location":"","page":"Home","title":"Home","text":"AD-backends are specified via subtypes of ADSelector, separate backends for forward and reverse mode AD can be specified if desired. Different AD specifiers that refer to the same AD-backend can be converted into each other via convert_ad.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The main functions are with_gradient and with_jacobian. Explicit Jacobian matrices can be obtained via jacobian_matrix. The central lower-level functions are with_jvp and with_vjp_func.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Operators (as returned from with_jacobian) can be converted to a LinearMaps.LinearMap.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Different Julia packages require function and gradient calculation to be passed in a different fashion. AutoDiffOperators provides","category":"page"},{"location":"","page":"Home","title":"Home","text":"valgrad_func(f, ad::ADSelector): generates f_∇f with y, δx = f_∇f(x).\ngradient_func(f, ad::ADSelector): generates ∇f with δx = ∇f(x).\ngradient!_func(f, ad::ADSelector): generates ∇f! with δx === ∇f!(δx, x).","category":"page"},{"location":"","page":"Home","title":"Home","text":"to cover several popular options.","category":"page"}]
}
